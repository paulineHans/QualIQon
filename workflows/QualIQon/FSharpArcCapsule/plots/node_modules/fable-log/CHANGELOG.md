# Change Log
--
#### 2015-02-18: Steven Velozo
* Finalized initial pattern
* Got test coverage and runners operating in a sane, repeatable way via internally installed libs rather than globals
* Started dumping in code from private repository, refactoring as we go

#### 2015-02-23: Steven Velozo
* Finished dumping and reorganizing code

#### 2015-04-03: Steven Velozo
* Documentation and examples
* Added automagic Mongo init (previously you had to explicitly init Mongodbs)
* Changed UUID to use fable-uuid

#### 2019-05-10: Steven Velozo
* Changed everything to es6 classes
* Added a lighter web built version via gulp
* Added timing methods for easy profiling
* Providers are abstracted to separate classes (e.g. so bunyan isn't built into the web version)
