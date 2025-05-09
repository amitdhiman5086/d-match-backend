import cron from "cron";
import https from "https";
const URL = "https://d-match-backend.onrender.com/api";
const URL2 = "https://d-match-frontend.onrender.com";
const job = new cron.CronJob("*/10 * * * *", function () {
	console.log("Cron job running every 10 minutes")
	https
		.get(URL, (res) => {
			if (res.statusCode === 200) {
				console.log("GET request sent successfully");
			} else {
				console.log("GET request failed", res.statusCode);
			}
		})
		.on("error", (e) => {
			console.error("Error while sending request", e);
		});
	https
		.get(URL2, (res) => {
			if (res.statusCode === 200) {
				console.log("GET request sent successfully");
			} else {
				console.log("GET request failed", res.statusCode);
			}
		})
		.on("error", (e) => {
			console.error("Error while sending request", e);
		});
});

job.start();