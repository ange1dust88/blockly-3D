/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { blocks } from "./blocks/text";
import { blocks as threeBlocks } from "./blocks/threeBlocks";

import { forBlock } from "./generators/javascript";
import { forBlock as forThreeBlock } from "./generators/threeGenerators";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "./serialization";
import { toolbox } from "./toolbox";
import {
  initThree,
  addObject,
  clearScene,
  setObjectColor,
  setObjectRotation,
  setObjectPosition,
  setObjectMaterial,
  setObjectScale,
  csgSubtract,
  csgUnion,
  csgIntersect, // ДОБАВЛЯЕМ ИМПОРТ
} from "./threeResult";

import "./index.css";

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(threeBlocks);
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
Object.assign(javascriptGenerator.forBlock, forThreeBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");
const threeObjects = initThree("threeResult");

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
const ws = Blockly.inject(blocklyDiv, { toolbox });

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
  if (codeDiv) codeDiv.textContent = code;

  if (outputDiv) outputDiv.innerHTML = "";

  clearScene(threeObjects);

  try {
    eval(`
      const threeObjects = window.threeObjects;
      const addObject = window.addObject;
      const setObjectPosition = window.setObjectPosition;
      const setObjectRotation = window.setObjectRotation;
      const setObjectColor = window.setObjectColor;
      const setObjectMaterial = window.setObjectMaterial;
      const setObjectScale = window.setObjectScale;
      const csgSubtract = window.csgSubtract; 
      const csgUnion = window.csgUnion;     
      const csgIntersect = window.csgIntersect; 
      
      ${code}
    `);
  } catch (error) {
    console.error("Error executing code:", error);
    if (outputDiv) outputDiv.textContent = `Error: ${error}`;
  }
};

(window as any).threeObjects = threeObjects;
(window as any).addObject = addObject;
(window as any).setObjectPosition = setObjectPosition;
(window as any).setObjectRotation = setObjectRotation;
(window as any).setObjectColor = setObjectColor;
(window as any).setObjectMaterial = setObjectMaterial;
(window as any).setObjectScale = setObjectScale;
(window as any).csgSubtract = csgSubtract;
(window as any).csgUnion = csgUnion;
(window as any).csgIntersect = csgIntersect;
(window as any).clearScene = clearScene;

ws.addChangeListener((e: Blockly.Events.Abstract) => {
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }

  runCode();
});
