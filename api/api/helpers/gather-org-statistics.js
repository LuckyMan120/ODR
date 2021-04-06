

const {dataTypes} = require('../enum/data-types.js');
const moment = require('moment');

function getMothsRange(beginDate) {
  const range = [];
  const start = moment(beginDate);
  const end = moment();

  while (
    end > start ||
    start.format('M') === end.format('M')
  ) {
    range.push({
      start: start.startOf('month').valueOf(),
      end: start.endOf('month').valueOf()
    });
    start.add(1, 'month');
  }

  return range;
}

async function getResolutionRate(org, start, end) {
  const closedCount = await Issue.count({
    org,
    submittedAt: {
      '>': start,
      '<': end
    },
    closedAt: {'>': 1}
  });

  const agreedCount = await Issue.count({
    org,
    submittedAt: {
      '>': start,
      '<': end
    },
    agreedAt: {'>': 1}
  });

  let resolutionRate = 0;

  if (closedCount) {
    resolutionRate = ((100 * agreedCount) / closedCount).toFixed();
  }

  return Number(resolutionRate);
}

async function getResponseTimeAverage(org, start, end) {
  const agreedAtIssues = await Issue.find({
    org,
    submittedAt: {
      '>': start,
      '<': end
    },
    agreedAt: {'>': 1}
  });

  return agreedAtIssues
    .map(({submittedAt, agreedAt}) => agreedAt - submittedAt)
    .reduce((acc, cur) => {
      acc += cur;
      return acc;
    }, 0) / agreedAtIssues.length;
}

async function getResolutionTimeAverage(org, start, end) {
  const agreedAtIssues = await Issue.find({
    org,
    submittedAt: {
      '>': start,
      '<': end
    },
    agreedAt: {'>': 1}
  });

  return agreedAtIssues
    .map(({submittedAt, closedAt}) => closedAt - submittedAt)
    .reduce((acc, cur) => {
      acc += cur;
      return acc;
    }, 0) / agreedAtIssues.length;
}

async function getTotalCount(org, start, end) {
  return await Issue.count({
    org,
    submittedAt: {
      '>': start,
      '<': end
    }
  });
}

async function countInRangeByType(org, start, end, type) {
  const issues = await Issue.find({
    org,
    submittedAt: {
      '>': start,
      '<': end
    }
  }).select(['id']);
  const count = await IssueData.count({
    type: dataTypes.issueCategory,
    value: type,
    issue: issues.map(issue => issue.id)
  });
  return count;
}

function getTimeFormat(date) {
  if (date) {
    return new Date(date).toISOString().substr(11, 8);
  } else {
    return '00:00:00';
  }
}

module.exports = {

  friendlyName: 'Gather org statistics',

  inputs: {
    orgId: {type: 'number', required: true},
    start: {type: 'number', required: true},
    end: {type: 'number', required: true}
  },

  fn: async function({orgId, start, end}) {

    const org = await Org.findOne(orgId);

    const ranges = getMothsRange(org.createdAt);

    const resolutionRateOverTime = [];
    const responseTimesOverTime = [];
    const resolutionTimeOverTime = [];
    const monthlyComplaintsOverTime = [];
    const typesDistribution = {
      categories: [],
      series: []
    };

    const types = [
      'advice',
      'productCharges',
      'performance',
      'behavior',
      'other'
    ];

    for (const type of types) {
      typesDistribution.series.push({
        name: type,
        data: new Array(ranges.length).fill(0)
      });
    }

    for (let index = 0; index < ranges.length; index++) {
      const {start, end} = ranges[index];

      resolutionRateOverTime.push([
        index + 1,
        await getResolutionRate(org.id, start, end)
      ]);

      responseTimesOverTime.push([
        index + 1,
        await getResponseTimeAverage(org.id, start, end)
      ]);

      resolutionTimeOverTime.push([
        index + 1,
        await getResolutionTimeAverage(org.id, start, end)
      ]);

      monthlyComplaintsOverTime.push([
        index + 1,
        await getTotalCount(org.id, start, end)
      ]);

      typesDistribution.categories.push(moment(start).format('MMMM'));
      for (const item of typesDistribution.series) {
        item.data[index] = await countInRangeByType(
          org.id,
          start,
          end,
          item.name
        );
      }

    }

    const agreedAtIssues = await Issue.find({
      org: orgId,
      submittedAt: {
        '>': start,
        '<': end
      },
      agreedAt: {'>': 1}
    });

    const responseTimeAverage = getTimeFormat(
      await getResponseTimeAverage(org.id, start, end)
    );

    const resolutionTimeAverage = getTimeFormat(
      await getResolutionTimeAverage(org.id, start, end)
    );

    const startOfYear = moment().startOf('year').valueOf();

    return {
      resolutionRate: await getResolutionRate(org.id, start, end),
      resolutionRateOverTime,

      responseTimes: {
        min: getTimeFormat(
          agreedAtIssues
            .map(({submittedAt, agreedAt}) => agreedAt - submittedAt)
            .sort((a, b) => a - b)[0]
        ),
        max: getTimeFormat(
          agreedAtIssues
            .map(({submittedAt, agreedAt}) => agreedAt - submittedAt)
            .sort((a, b) => b - a)[0]
        ),
        average: responseTimeAverage
      },
      responseTimesOverTime,

      resolutionTime: {
        min: getTimeFormat(
          agreedAtIssues
            .map(({submittedAt, closedAt}) => closedAt - submittedAt)
            .sort((a, b) => a - b)[0]
        ),
        max: getTimeFormat(
          agreedAtIssues
            .map(({submittedAt, closedAt}) => closedAt - submittedAt)
            .sort((a, b) => b - a)[0]
        ),
        average: resolutionTimeAverage
      },
      resolutionTimeOverTime,

      monthlyComplaintsOverTime,

      typesDistribution,

      complaintsMetrics: {
        received: {
          month: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': start,
              '<': end
            }
          }),
          year: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': startOfYear,
              '<': end
            }
          })
        },
        closed: {
          month: await Issue.count({
            org: org.id,
            closedAt: {
              '>': start,
              '<': end
            }
          }),
          year: await Issue.count({
            org: org.id,
            closedAt: {
              '>': startOfYear,
              '<': end
            }
          })
        },
        resolved: {
          month: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': start,
              '<': end
            },
            status: 'closedAgreement'
          }),
          year: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': startOfYear,
              '<': end
            },
            status: 'closedAgreement'
          })
        },
        unresolved: {
          month: await Issue.count({
            org: org.id,
            closedAt: {
              '>': start,
              '<': end
            },
            status: {'!=': 'closedAgreement'}
          }),
          year: await Issue.count({
            org: org.id,
            closedAt: {
              '>': startOfYear,
              '<': end
            },
            status: {'!=': 'closedAgreement'}
          })
        },
        withdrawn: {
          month: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': start,
              '<': end
            },
            status: 'closedWithdrawn'
          }),
          year: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': startOfYear,
              '<': end
            },
            status: 'closedWithdrawn'
          })
        },
        escalatedToAFCA: {
          month: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': start,
              '<': end
            },
            status: 'closedEscalatedOmbudsman'
          }),
          year: await Issue.count({
            org: org.id,
            submittedAt: {
              '>': startOfYear,
              '<': end
            },
            status: 'closedEscalatedOmbudsman'
          })
        },
        responseTime: {
          month: responseTimeAverage,
          year: getTimeFormat(
            await getResponseTimeAverage(org.id, startOfYear, end)
          )
        },
        timeToResolution: {
          month: resolutionTimeAverage,
          year: getTimeFormat(
            await getResolutionTimeAverage(org.id, startOfYear, end)
          )
        }
      }
    };
  }

};
