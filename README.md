# myplanner
Site: https://myplanner-osu.herokuapp.com/

Dev Environment
Your local environment will be where you create branches and do all of your dev work.

## Initial Setup
1. Make sure you have git installed on your computer. If you don't you can grab the latest version here: https://git-scm.com/downloads
2. Pick an appropriate location on your computer to work from and clone this repo into that directory using the following command:
	git clone https://github.com/myplanner/myplanner.git
3. Run the following git command: git remote get-url origin
	If the following did not return "https://github.com/myplanner/myplanner.git" then you will need to run another command:
	git remote add origin https://github.com/myplanner/myplanner.git
4. Run: npm install
	This will install dependencies in package.json
5. Run: bower install
	This will install dependencies in the bower.json file
6. Your local repository should now be fully set up to work with the remote repo

## Development
A good rule of thumb to follow is to create a new, descriptive branch title to work from in your local repo whenever you are working on a new feature (avoiding arbitrary numbers and dates). For example, if you're working on a daily view for the calendar, you can name your branch "calendar_daily-view". To work on a new branch:
NOTE: Always create a new branch off of master, not any branches you've created.
1. Enter the following command: git checkout -b <branch name>
	This will create a new branch and automatically switch you to it. It's a bad idea to work directly on the master branch since pushing to the master branch in GitHub will automatically update the Heroku app and potentially crash it while others may be using it for testing.
2. To run a local instance of the server (a server running on your machine instead of Heroku) you can simpy run: npm start
	This will get an instance running at localhost:8000 (you can put that into a browser and see the app running there). As you make changes you can simply refresh and the changes should take effect. The only time this does not occur is if you've made a change to something that is cached at launch. In that case you will need to restart the server instance.
3. Once you've made all the changes you need to, you'll need to commit and push your changes. To do this:
	git add <filename> <additional filename> <another filename> etc.
	git commit -m "Some message describing what is contained in this commit" (must use double quotes)
	git push origin <your branch name>
	This last command will tell git to push your branch to the remote repo that is nicknamed origin. You will then be able to see your branch on GitHub.
4. Go to GitHub and select the option to create a new pull request. Set the base branch to master and the to-be-merged branch to the one you recently pushed.
5. Ideally we would do some code review here - this will likely only happen in a couple of cases since we're pressed for time. If there aren't any merge conflicts, you can go ahead and merge the branches. We can roll back if necessary.
6. This part is important - if something new has been added to master, on your local repo:
	git checkout master (switching your branch back to master)
	git pull origin master (updates master with all the newest updates)
7. You're ready to create a new branch off of master.