import { Order } from "blockly/javascript";
import * as Blockly from "blockly/core";

export const forBlock = Object.create(null);

forBlock["add_object"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const objectType = block.getFieldValue("OBJECT_TYPE");
  const varName = block.getFieldValue("VAR");
  return `addObject(threeObjects, "${objectType}", "${varName}");\n`;
};

forBlock["set_position"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const varName = block.getFieldValue("VAR");
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const z = generator.valueToCode(block, "Z", Order.ATOMIC) || "0";

  return `setObjectPosition("${varName}", ${x}, ${y}, ${z});\n`;
};

forBlock["set_rotation"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const varName = block.getFieldValue("VAR");
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const z = generator.valueToCode(block, "Z", Order.ATOMIC) || "0";

  return `setObjectRotation("${varName}", ${x}, ${y}, ${z});\n`;
};

forBlock["set_color"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const varName = block.getFieldValue("VAR");
  const r = generator.valueToCode(block, "R", Order.ATOMIC) || "0";
  const g = generator.valueToCode(block, "G", Order.ATOMIC) || "0";
  const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";

  return `setObjectColor("${varName}", ${r}, ${g}, ${b});\n`;
};
