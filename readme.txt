Things to do

1. goto A_Web_Server/var/www/html/Running_AdminConsole/campaignManager/services
2. add or create flushTool.js & runCron.sh files there
3. edit flushTool.js
	i. insert campaign numberto campaignIds array.

	ii. change url as said in it. 
	find right url from app.js -> base urls -> campaignmanagerUrl
	remember to add>>> /Camapaign/ at the end of the url
	ex: var url = "http://campaignmanager.app1.veery.cloud/DVP/API/1.0.0.0/CampaignManager/Campaign/";
	
	iii. change token if have to
	
	iv. chanhe companyInfo header
		"CompanyInfo": "TennantID:CompanyID"

4. make runCron.sh file executable
	chmod +x runCron.sh

5. edit runCron.sh file
	i. edit as said in it.
	ex: node /var/www/Running-AdminConsole/campaignManager/services/flushTool.js

6. set cron job to runCron.sh file
	i. in terminal, type crontab -e
	at the end of the crontab file, insert new cron job.
	ex: run a cron job every minute.
		* * * * * /path/to/file.sh
	in our case : * * * * * /var/www/html/Running-AdminConsole/campaignManager/services/runCron.sh
	#above code will execute runCron.sh file every minute.
	To run at 23.59 every day
	59 23 * * * /var/www/html/Running-AdminConsole/campaignManager/services/runCron.sh
_________________________________________________________________________________________________________________
Thats it. test before use.
call me for help
0787256838

	

