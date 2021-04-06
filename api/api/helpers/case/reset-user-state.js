// api/helpers/case/reset-user-state.js

const stepConditionTest = async conditions => {
  /**
   * example: {"dataExists": [{"dataType": 1, "party": "my", "min": 2}]
   *
   * Calculation of a step's state:
   Based on step.conditions.
   ATM we only have conditions that relate to
   caseData and we only have conditions for enable
   example: "show": {}, "enable":
   {"dataExists": [{"dataType": 3, "party": "my", "min": 2}]}
   the enable conditions will only be true caseData where
   caseData.party = my partyID
   and there are at least two of those
   the party condition  can be "my", "all", "others"
   (others mean all other parties)
   if condition is an empty object (like "show" above) it return true
   */
  // @todo

  // temp return for linting
  if (conditions) {
    return true;
  }

};

module.exports = {

  friendlyName: 'Reset state of all users of selected case',

  description: '`Calculate all case steps and their state ' +
    'for each user and save in caseUser table as json' +
    ' so it can be used to show case nav in front end`',

  inputs: {

    case: {
      type: 'number',
      example: 345,
      description: 'Case ID',
      required: true
    }

  },

  fn: async function(inputs, exits) {

    const thisCase = Case.findOne(inputs.case)
      .populate(users);

    _.each(thisCase.users, (caseUser) => {

      const caseUserState = [];

      const steps = Steps.find({
        where: {
          pathway: caseUser.pathway,
          parentId: 0
        }
      })
        .populate(children); // and sort by sortOrder, children as well!

      let stateStep;
      let childStepState;
      // let completedChildrenCount;

      _.each(steps, (step) => {

        // if show condition and they fail - show is false
        if (step.conditions && step.conditions.show) {
          stateStep.show = stepConditionTest(step.conditions.show);
        } else {
          stateStep.show = true;
        }
        /**
         * example conditions field:
          "conditions": {
            "show": {"dataExists": [{"dataType": 6, "party": "my"}]},
            "enable": {"dataExists": [{"dataType": 1, "party": "my", "min": 2}]}
          }
         */

        // if conditions to enable they must be met
        if (step.conditions && step.conditions.enable) {
          stateStep.enable = stepConditionTest(step.conditions.enable);
        } else {
          stateStep.enable = true;
        }

        // if conditions to complete and they are not met
        if (step.conditions && step.conditions.complete) {
          stateStep.complete = stepConditionTest(step.conditions.complete);
        } else {
          stateStep.complete = true;
        }

        stateStep = {children: []};
        completedChildrenCount = 0;

        _.each(step.children, (childStep) => {
          childStepState = {};

          // if show condition and they fail - show is false
          if (step.conditions && step.conditions.show) {
            childStepState.show = stepConditionTest(step.conditions.show);
          } else {
            childStepState.show = true;
          }

          // if this is current step, so is its parent
          if (caseUser.lastStep === childStep.id) {
            childStepState.current = true;
            stateStep.current = true;
          }

          // if conditions to enable they must be met
          if (childStepState.conditions && childStepState.conditions.enable) {
            childStepState.enable = stepConditionTest(
              childStepState.conditions.enable
            );
          } else {
            childStepState.enable = true;
          }
          // and that affects parent
          if (childStepState.enable) {
            stateStep.enable = true;
          }

          // if conditions to complete and they are not met
          if (childStepState.conditions && childStepState.conditions.complete) {
            childStepState.complete = stepConditionTest(
              childStepState.conditions.complete
            );
          } else {
            childStepState.complete = true;
          }

          // UPSERT this childStepState as a record in CaseUserStep table
          // push below is TEMP, just for linting....
          stateStep.children.push(childStepState);
        });

        // @todo if all children are completed - so is this...
        // @todo if all children are not enabled - so is this...
        // UPSERT this childStepState as a record in CaseUserStep table
        // push below is TEMP, just for linting....
        caseUserState.push(stateStep);
      });

    });

    // TEMP constant as example
    const sampleResult = [
      {
        name: 'Overview',
        completed: true,
        stepId: 3 + inputs.case, // temp - to get around linting
        current: true, // when child of it is current
        children: [
          {
            name: 'Ground Rules',
            completed: true,
            stepId: 4
          },
          {
            name: 'What Happened',
            completed: false,
            current: true, // if same as this caseUser's lastOpenStep
            stepId: 5
          }
        ]
      }
    ];

    return exits.success(sampleResult);
  }

};
