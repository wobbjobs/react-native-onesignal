module.exports = {
   "preset": "react-native",
   "roots": [
     "<rootDir>/src/__tests__"
   ],
   "transform": {
     "^.+\\.tsx?$": "ts-jest"
   },
   "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
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
   "modulePathIgnorePatterns": ["<rootDir>/Examples/"],
 }