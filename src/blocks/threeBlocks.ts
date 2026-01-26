import * as Blockly from "blockly/core";

export const blocks = {
  add_object: {
    init: function (this: Blockly.Block) {
      this.jsonInit({
        message0: "Add 3D %1 as %2",
        args0: [
          {
            type: "field_dropdown",
            name: "OBJECT_TYPE",
            options: [
              ["cube", "cube"],
              ["sphere", "sphere"],
              ["cylinder", "cylinder"],
              ["cone", "cone"],
              ["torus", "torus"],
            ],
          },
          {
            type: "field_variable",
            name: "VAR",
            variable: "obj",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "Adds a 3D object and stores it in a variable",
        helpUrl: "",
      });
    },
  },

  set_position: {
    init: function (this: Blockly.Block) {
      this.jsonInit({
        message0: "set position of %1 to X: %2 Y: %3 Z: %4",
        args0: [
          {
            type: "field_variable",
            name: "VAR",
            variable: "obj",
          },
          {
            type: "input_value",
            name: "X",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "Y",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "Z",
            check: "Number",
            align: "RIGHT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 200,
        tooltip: "Sets position of a 3D object",
        helpUrl: "",
      });
    },
  },

  set_rotation: {
    init: function (this: Blockly.Block) {
      this.jsonInit({
        message0: "set rotation of %1 to X: %2 Y: %3 Z: %4",
        args0: [
          {
            type: "field_variable",
            name: "VAR",
            variable: "obj",
          },
          {
            type: "input_value",
            name: "X",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "Y",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "Z",
            check: "Number",
            align: "RIGHT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 200,
        tooltip: "Sets rotation of a 3D object",
        helpUrl: "",
      });
    },
  },

  set_color: {
    init: function (this: Blockly.Block) {
      this.jsonInit({
        message0: "set RGB color of %1 R: %2 G: %3 B: %4",
        args0: [
          {
            type: "field_variable",
            name: "VAR",
            variable: "obj",
          },
          {
            type: "input_value",
            name: "R",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "G",
            check: "Number",
            align: "RIGHT",
          },
          {
            type: "input_value",
            name: "B",
            check: "Number",
            align: "RIGHT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 200,
        tooltip: "Sets RGB color of a 3D object (0-255)",
        helpUrl: "",
      });
    },
  },
};
