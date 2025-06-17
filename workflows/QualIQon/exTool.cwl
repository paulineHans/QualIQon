#!/usr/bin/env cwl-runner

cwlVersion: v1.2
class: ExpressionTool
label: Returns a directory named after inputs.newname, containing all input files and directories.

requirements:
  InlineJavascriptRequirement: {}

inputs:
  file_single:
    type: File?
    label: A single file which will be placed in the output directory.
  file_array:
    type: File[]?
    label: An array of files which will be placed in the output directory.
  directory_single:
    type: Directory?
    label: A single directory which will be placed in the output directory as a subdirectory.
  directory_array:
    type: Directory[]?
    label: An array of directories which will be placed in the output directory as subdirectories.
  newname:
    type: string?
    label: Name of the output-directory. If no input is provided, tool will try use the nameroot of file_single, directory_single, file_array[0], directory_array[0] (in this order).

outputs:
  pool_directory:
    type: Directory
    label: Directory where all input files and subdirectories will be pooled. Named after inputs.newname.

expression: |
  ${
    //Check if an input for newname was provided. If yes, use this as new directory name.
    var newName = "";
    var needName = true;
    if ( inputs.newname != undefined ) {
      newName = inputs.newname;
      needName = false;
    }
    //Check which input files / directories are present. Add them to the new directory.
    //If no input for newname was provided, use the name of one of the files or directories.
    var outputList = [];
    if ( inputs.file_single != undefined ) {
      outputList.push( inputs.file_single );
      if ( needName ) {
        newName = inputs.file_single.nameroot;
        needName = false;
      }
    }
    if ( inputs.directory_single != undefined ) {
      outputList.push( inputs.directory_single );
      if ( needName ) {
        newName = inputs.directory_single.basename;
        needName = false;
      }
    }
    if ( inputs.file_array != undefined ) {
      for ( var count = 0; count < inputs.file_array.length; count++ ) {
        var nextfile = inputs.file_array[count];
        outputList.push( nextfile );
      }
      if ( needName ) {
        newName = inputs.file_array[0].nameroot;
        needName = false;
      }
    }
    if ( inputs.directory_array != undefined ) {
      for ( var count = 0; count < inputs.directory_array.length; count++ ) {
        var nextdir = inputs.directory_array[count];
        outputList.push( nextdir );
      }
      if ( needName ) {
        newName = inputs.directory_array[0].basename;
        needName = false;
      }
    }
    return {
      "pool_directory": {
        "class": "Directory",
        "basename": newName,
        "listing": outputList
      }
    };
  }

arc:has technology type:
  - class: arc:technology type
    arc:annotation value: "Docker Image"

arc:technology platform: ".NET"

arc:performer:
  - class: arc:Person
    arc:first name: "Pauline"
    arc:last name: "Hans"
    arc:email: "phans@rptu.de"
    arc:affiliation: "Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau"