cwlVersion: v1.2
class: CommandLineTool
hints:
  DockerRequirement:
    dockerImageId: "devcontainer2"
    dockerFile: {$include: "./Dockerfile"}
requirements:
  - class: InitialWorkDirRequirement
    listing:
      - entryname: arc
        entry: $(inputs.arcDirectory)
        writable: true
  - class: EnvVarRequirement
    envDef:
      - envName: DOTNET_NOLOGO
        envValue: "true"
  - class: NetworkAccess
    networkAccess: true
baseCommand: [dotnet, fsi, "./arc/workflows/QualIQon/FSharpArcCapsule/mainScripts/main_Evidence.fsx"]

inputs:
  arcDirectory:
    type: Directory
  directoryPath: 
    type: string
    inputBinding: 
      position: 2
  pipeline: 
    type: string 
    inputBinding: 
      position: 3
  FASTA: 
    type: string
    inputBinding: 
      position: 4

outputs:
  output_Evidence:
    type: Directory 
    outputBinding:
      glob: ./arc/runs$(inputs.directoryPath)/Results/Evidence

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