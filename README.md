![Banner](https://github.com/project-gullwing/gullbox/blob/master/files/banner.png)

# GULLbox (gullwing toolbox)
Set of useful tools for the gullwing project.


## Dev info 
Implemented in Elm 0.19.1

### Local test
Install `elm-live`:
```
npm install -g elm-live
```
Run in project folder:
```
elm-live src/Main.elm --pushstate --dir=./docs -- --output=./docs/elm.js  
```

### Build
```
elm make src/Main.elm --optimize --output=docs/elm.js
```

### Units - code nomenclature

| `Angle` | `α` |
|---|---|
| Degrees | deg |
| Radians | rad |

| `Angular speed` | `ϖ` |
|---|---|
| Radians / second | radSec |
| Degrees / second | degSec |
| Revs per minute | RPM |

| `Angular acceleration` | `ϖ′` |
|---|---|
| Radians / second<sup>2</sup> | radSec2 |
| Degrees / second<sup>2</sup> | degSec2 |

| `Time`, `Interval` | `t`, `c` |
|---|---|
| seconds | sec |
| micro seconds | usec |

| `Frequency` | `f` |
|---|---|
| Hertz | Hz |
| Megahertz | MHz |
