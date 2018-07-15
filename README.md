### Installation
`npm i`

### Testing
- Run `npm run ios` to run the app on iOS simulator
- Run `npm run android` to run the app on Android simulator/device.

### Release builds
#### iOS
- Run your app with `npm run ios-release`.
- In Xcode switch scheme to `Pearson 360 Release` and do an archive in Xcode.

#### Android
- Run `npm run android-release` to test the release build on Android simulator/device.
- Run `npm run build-android` to generate release apk. The file will be saved at `android/app/build/outputs/apk/app-release.apk`.

## Development

The repository should hold two main branches:

- **master** - reflects a *production-ready* state
- **development** - reflects a state with the latest delivered development changes for the next release

**Please note that every commit to develop should provide working, stable copy of the app.**

Next to the main branches master and develop there should be supporting branches:
- feature branch
- release branch
- bugfix branch

Each of these branches have a specific purpose and are bound to strict rules as to which branches may be their originating branch and which branches must be their merge targets.

#### Branches & app builds

###### Development branch

The develop branch and feature branches reflects the latest development changes and can be used for internal development app builds.

###### Release branch

Release branch contains only code that should be included in the production version. Every merge to **master** should increase the app version number.

###### Bugfix branch

When a critical bug in a production version must be resolved immediately, a bugfix branch may be branched off from the corresponding tag on the master branch that marks the production version

#### Feature branches

The are used to develop new features for the upcoming or a distant future release.

###### Creating feature branch
Feature branch may branch off from **development** and must merge back (**merge squash**) into **development**.

Branch naming convention:
anything except master, develop, release-*, or bugfix-* but ideally prefixed by **feature/***

### Pull Request Guideline

#### Assignees and reviewers
Assign reviewers if you want specific persons to take a look at your pull request. While assignees should be optional for the pull request to get merged in, reviewers need to approve.

#### Merging
Once a pull request is approved, the reviewer(s) should add the `reviewed` label. This means this pull request is free to be merged in by anyone. Please squash your commits on merge.

#### After merging
Make sure to delete the branch.

#### Troubleshooting
In case of problems with running with the app you can try following.
- Delete the node_modules folder - `rm -rf node_modules && npm install`
- Reset packager cache - `rm -fr $TMPDIR/react-* or node_modules/react-native/packager/packager.sh --reset-cache`
- Clear watchman watches - `watchman watch-del-all`
