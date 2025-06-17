cwlVersion: v1.2
class: CommandLineTool

requirements:
  - class: InitialWorkDirRequirement
    listing:
      - entryname: arc
        entry: $(inputs.arcDirectory)
        writable: true
  - class: NetworkAccess
    networkAccess: true
baseCommand: [dotnet, fsi, "./arc/workflows/QualIQon/FSharpArcCapsule/mainScripts/main_Heatmaps.fsx"]

inputs:
  arcDirectory:
    type: Directory
  directoryPath: 
    type: string
    inputBinding: 
      position: 2
  labelling: 
    type: string 
    inputBinding: 
      position: 3
  pipeline: 
    type: string
    inputBinding: 
      position: 4

outputs:
  output_Heatmaps:
    type: Directory 
    outputBinding:
      glob: ./arc/runs$(inputs.directoryPath)/Results/Heatmaps

