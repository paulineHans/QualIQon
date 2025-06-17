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
baseCommand: [dotnet, fsi, "./arc/workflows/QualIQon/FSharpArcCapsule/mainScripts/main_Correlation.fsx"]
inputs:
  arcDirectory:
    type: Directory
  directoryPath: 
    type: string
    inputBinding: 
      position: 1
  labelling: 
    type: string 
    inputBinding: 
      position: 2

outputs:
  output_Correlation:
    type: Directory
    outputBinding:
      glob: ./arc/runs$(inputs.directoryPath)/Results/Correlation

