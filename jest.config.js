module.exports = {
   "preset": "react-native",
   "roots": [
     "<rootDir>/src/__tests__"
   ],
   "transform": {
     "^.+\\.jsx?$": "babel-jest",
     "^.+\\.tsx?$": "ts-jest",
     "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
   },
   "testRegex": "(/__tests__/.*|\\.(test|spec))\\.ts$",
   "testPathIgnorePatterns": [".d.ts$", "/node_modules/"],
   "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
   ],
   "globals": {
     "ts-jest": {
       "tsConfigFile": "<rootDir>/tsconfig.json"
     }
   },
   "modulePathIgnorePatterns": ["<rootDir>/Examples/"]
 }