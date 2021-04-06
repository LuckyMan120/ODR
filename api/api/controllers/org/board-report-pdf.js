

const axios = require('axios');
const moment = require('moment');
const {readFileSync} = require('fs');

const highchartshs = readFileSync(
  `${process.cwd()}/assets/dependencies/highcharts.js`,
  'utf8'
);

module.exports = {

  friendlyName: 'Board report pdf',

  description: '',

  inputs: {
    start: {type: 'number', required: true},
    end: {type: 'number', required: true}
  },

  // eslint-disable-next-line
  fn: async function ({start, end}, exits) {

    const month = moment(start).format('MMMM YYYY');
    const width = 800;
    const height = 400;
    const statistics = await sails.helpers.gatherOrgStatistics(
      this.req.session.orgId,
      start,
      end
    );

    const template = await sails.renderView(
      'pdfTemplates/boardReport/html',
      {
        layout: '../layout',

        moment,
        highchartshs,

        org: await Org.findOne(this.req.session.orgId),
        month,

        resolutionRatesOverTime: JSON.stringify({
          chart: {width, height},
          title: {text: 'Resolution rates over time'},
          credits: {enabled: false},
          exporting: {enabled: false},
          plotOptions: {
            series: {
              animation: false,
              enableMouseTracking: false
            }
          },
          legend: {enabled: false},
          yAxis: {
            title: {text: 'Rates %'},
            max: 100,
            min: 0
          },
          xAxis: {
            title: {text: 'Month'},
            tickInterval: 1
          },
          series: [{
            data: statistics.resolutionRateOverTime
          }]
        }),
        aveResponseTime: JSON.stringify({
          chart: {width, height},
          title: {text: 'Ave. Response time'},
          credits: {enabled: false},
          exporting: {enabled: false},
          plotOptions: {
            series: {
              animation: false,
              enableMouseTracking: false
            }
          },
          legend: {enabled: false},
          yAxis: {
            title: {text: 'Time'},
            labels: {enabled: false}
          },
          xAxis: {
            title: {text: 'Month'},
            tickInterval: 1
          },
          series: [{
            data: statistics.responseTimesOverTime
          }]
        }),
        timeToResolution: JSON.stringify({
          chart: {width, height},
          title: {text: 'Time to resolution'},
          credits: {enabled: false},
          exporting: {enabled: false},
          plotOptions: {
            series: {
              animation: false,
              enableMouseTracking: false
            }
          },
          legend: {enabled: false},
          yAxis: {
            title: {text: 'Time'},
            labels: {enabled: false}
          },
          xAxis: {
            title: {text: 'Month'},
            tickInterval: 1
          },
          series: [{
            data: statistics.resolutionTimeOverTime
          }]
        }),
        monthlyComplaints: JSON.stringify({
          chart: {width, height},
          title: {text: 'Monthly complaints'},
          credits: {enabled: false},
          exporting: {enabled: false},
          plotOptions: {
            series: {
              animation: false,
              enableMouseTracking: false
            }
          },
          legend: {enabled: false},
          yAxis: {title: {text: 'Complaints'}},
          xAxis: {
            title: {text: 'Month'},
            tickInterval: 1
          },
          series: [{
            data: statistics.monthlyComplaintsOverTime
          }]
        }),
        complaintTypeDistribution: JSON.stringify({
          chart: {type: 'bar', width, height},
          title: {text: 'Complaint type distribution'},
          credits: {enabled: false},
          exporting: {enabled: false},
          plotOptions: {
            series: {
              animation: false,
              enableMouseTracking: false
            }
          },
          yAxis: {title: {text: null}},
          xAxis: {
            categories: statistics.typesDistribution.categories,
            title: {text: null},
            tickInterval: 1
          },
          series: statistics.typesDistribution.series
        }),

        statistics: await sails.helpers.gatherOrgStatistics(
          this.req.session.orgId,
          start,
          end
        )
      }
    );

    const url = await sails.helpers.htmlToPdf(
      template,
      `Board_Report_${month}_${Date.now()}`
    );

    const pdf = await axios({
      url,
      method: 'get',
      responseType: 'stream'
    });

    this.res.set('Content-Type', 'application/pdf');

    pdf.data.pipe(this.res);

  }

};
