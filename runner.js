const cypress = require('cypress')
const marge = require('mochawesome-report-generator')
const { merge } = require('mochawesome-merge')
const moment = require('moment')

// get current run timestamp
const currRunTimestamp = getTimeStamp();

//Get cypress CLI options using 'minimist
const args = require('minimist')(process.argv.slice(3));
console.log("args",args);

// get environment from args..
const environment = getEnvironment(args);

//source directory where individual test reports are created
const sourceReport = {
    files: ["./reports/" + environment + "/" + "TestRun-" + currRunTimestamp + "/mochawesome-report/*.json"]
}

//destination directory where we want our unified .html and .json file to be placed
const finalReport = {
    reportDir: 'reports/'+ environment + "/" +  "TestRun-" + currRunTimestamp,
    saveJson: true,
    reportFilename: 'Run-Report',
    reportTitle: 'Run-Report',
    reportPageTitle: 'Run-Report'
}

//Cypress Module API
cypress.run({   
    ...args,                           
    config: {
        pageLoadTimeout: 20000,
        screenshotsFolder: 'reports/' + environment + "/" + "TestRun-" + currRunTimestamp + '/screenshots',
        video: true,
        videosFolder: 'reports/' + environment + "/" + "TestRun-" + currRunTimestamp + '/videos'
    },
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'reports/' + environment + "/" + "TestRun-" + currRunTimestamp + '/mochawesome-report',
        overwrite: false,
        html: true,
        json: true
    }
})
.then(result => {
	
    // generate a unified report, once Cypress test run is done
    generateReport()
    .then(() => {
        console.log("Test Report has been generated");
    })
    .catch(err => {
        console.error("Getting error while generating reports: ", err.message)
    })
    .finally(() => {
        console.log("Test Run Completed at " + result.endedTestsAt);
        console.log("Total time taken " + new Date(result.totalDuration).toISOString().substr(11, 8));
    })
  
    })
.catch(err => {
    console.error(err.message)
    process.exit(1)
  })
  
// identify an environment; default is "qa"
function getEnvironment(args){

 let environment;

  if(args.env){
    if(args.env === true){
		// if --env flag is passed from CLI but without following any arguments
        environment = "qa";
        return "qa";
    }

  const getEnv = args.env.split(",");
 
  getEnv.map((curr, index) => {

    const envProperty = curr.split("=");

    if(envProperty[0] === 'configFile'){
        environment = envProperty[1];
    }

    if(index >= getEnv.length && environment === undefined){
		// if --env flag is passed from CLI, but doesn't contain any 'configFile' argument
        environment = "qa";
    }

 })

 return environment;

} else{
	// if no --env flag is passed from CLI
    environment = "qa";
    return "qa";
 }
}

//get current timestamp
function getTimeStamp() {
    var now = new moment().format('DD-MM-YYYY--HH_mm_ss')
    return now
}

//generate unified report from sourecReport.files directory and create a unified report and store it in finalReport.reportDir location
function generateReport() {
    return  merge(sourceReport).then(report => {
        marge.create(report, finalReport)
        .then(result => {
            console.log("Run report saved at " + result[0]);
        })
        .catch(err => {
            console.error("Getting error while merging reports: ", err.message)
        })
        .finally(() => {
            process.exit()
        });
    });
}