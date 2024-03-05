import { defineConfig } from 'cypress'

export default defineConfig({
  //reporter: 'cypress-mochawesome-reporter',
  video: false,
  reporterOptions: {
    charts: true,
    reportDir: "cypress/report",
    reportPageTitle: 'admin-report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true 
  },
  e2e: {
    // setupNodeEvents(on, config) {
    //   require('cypress-mochawesome-reporter/plugin')(on);
    // },
    baseUrl: 'http://localhost:4200',
  },
})