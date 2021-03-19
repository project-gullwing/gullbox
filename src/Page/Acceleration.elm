module Page.Acceleration exposing (..)

import Calculations.AccelRamp as AccelRamp exposing (Ramp)
import Calculations.Stepper as Stepper
import Html exposing (..)
import Html.Attributes exposing (class, disabled, for, hidden, id, style, type_, value)
import Html.Events exposing (..)
import LineChart exposing (Config)
import LineChart.Area as Area
import LineChart.Axis as Axis
import LineChart.Axis.Intersection as Intersection
import LineChart.Axis.Line as AxisLine
import LineChart.Axis.Range as Range
import LineChart.Axis.Ticks as Ticks
import LineChart.Axis.Title as Title
import LineChart.Colors as Colors
import LineChart.Container as Container
import LineChart.Dots as Dots
import LineChart.Events as Events
import LineChart.Grid as Grid
import LineChart.Interpolation as Interpolation
import LineChart.Junk as Junk
import LineChart.Legends as Legends
import LineChart.Line as Line
import Color
import Loading exposing (LoaderType(..), defaultConfig)
import Process
import Task exposing (Task)
import Utils.Conversions as Conversions
import Utils.Formatters as Formatters
import Utils.Validations as Validations


-- CONSTANTS

label_ACCEL =
    "\u{03C9}\u{2032}"

range_ACCEL =
    (10, 500)

label_MIN_INTERVAL =
    "cMin"

range_MIN_INTERVAL =
    (300, 1000)

label_STEP_ANGLE =
    "\u{03B1}"

range_STEP_ANGLE =
    (0.1, 360)

label_TIMER_FREQUENCY =
    "f"

range_TIMER_FREQUENCY =
    (0.1, 10)


type alias Point =
  { x : Float, y : Float }


-- MODEL

type alias Model = {
        acceleration_radSec : Validations.FloatValue,
        minInterval_usec : Validations.FloatValue,
        stepAngle_deg : Validations.FloatValue,
        timerFrequency_mHz : Validations.FloatValue,
        delays : List Float,
        ramp : Ramp,
        showSteps : Bool,
        inProgress : Bool
    }



-- INIT

init : () -> ( Model, Cmd Msg )
init _ =
  (
    {
        acceleration_radSec = Validations.validateFloatValue "35.0" label_ACCEL range_ACCEL,
        minInterval_usec = Validations.validateFloatValue "300.0" label_MIN_INTERVAL range_MIN_INTERVAL,
        stepAngle_deg = Validations.validateFloatValue "1.8" label_STEP_ANGLE range_STEP_ANGLE,
        timerFrequency_mHz = Validations.validateFloatValue "1" label_TIMER_FREQUENCY range_TIMER_FREQUENCY,
        delays = [],
        ramp = {
            graph = []
        },
        showSteps = False,
        inProgress = False
    },
    Cmd.none)



-- UPDATE

type Msg
  = UpdateAcceleration String
  | UpdateMinInterval String
  | UpdateStepAngle String
  | UpdateTimerFrequency String
  | CalculateRamp
  | RampReceived (List Float, Ramp)
  | ToggleShowSteps


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateAcceleration value ->
          ( {model | acceleration_radSec = Validations.validateFloatValue value label_ACCEL range_ACCEL}, Cmd.none)

        UpdateMinInterval value ->
          ( {model | minInterval_usec = Validations.validateFloatValue value label_MIN_INTERVAL range_MIN_INTERVAL}, Cmd.none)

        UpdateStepAngle value ->
          ( {model | stepAngle_deg = Validations.validateFloatValue value label_STEP_ANGLE range_STEP_ANGLE}, Cmd.none)

        UpdateTimerFrequency value ->
          ( {model | timerFrequency_mHz = Validations.validateFloatValue value label_TIMER_FREQUENCY range_TIMER_FREQUENCY}, Cmd.none)

        CalculateRamp ->
            case [model.acceleration_radSec.val, model.minInterval_usec.val, model.stepAngle_deg.val, model.timerFrequency_mHz.val] of
                [Just acceleration_radSec2, Just minStepInterval_usec, Just stepAngle_deg, Just timerFrequency_MHz] ->
                    ( {model |
                        inProgress = True,
                        delays = [],
                        ramp = {
                            graph = []
                        }
                    },
                    Process.sleep 100 |> Task.perform (\_ -> RampReceived (calcRamp acceleration_radSec2 minStepInterval_usec stepAngle_deg timerFrequency_MHz)))
                _ ->
                    ( model, Cmd.none)

        RampReceived (delays, ramp) ->
            ( {model |
                delays = delays,
                ramp = ramp,
                inProgress = False
            }, Cmd.none)

        ToggleShowSteps ->
            ({model | showSteps = (not model.showSteps)}, Cmd.none)


-- VIEW


view : Model -> Html Msg
view model =
    div [class "flex-column"] [
        h3 [] [text "Stepper acceleration profile"],
        h4 [] [text "Input"],
        div [class "grid"] [

        -- Acceleration
            label [
                for "inputAccel",
                class "item-label cy bold"
            ]
            [
                text "\u{03C9}\u{2032}"
            ],
            input [
                type_ "text",
                id "inputAccel",
                class "item-input cy",
                value model.acceleration_radSec.str,
                onInput UpdateAcceleration
            ] [],
            div [
                class "item-unit cy bold"
            ] [
                text "radians / sec",
                sup [] [
                    text "2"
                ]
            ],
            div [
                class "item-desc cy"
            ] [
                text "(Angular acceleration)"
            ],
            div [
                class "item-err"
            ]
            (List.map errorItem model.acceleration_radSec.errors),

        -- Min. interval
            label [
                for "inputDelay",
                class "item-label cy bold darker-row"
            ] [
                text "c",
                sub [] [
                    text "min"
                ]

            ],
            input [
                type_ "text",
                id "inputDelay",
                class "item-input",
                value model.minInterval_usec.str,
                onInput UpdateMinInterval
            ] [],
            div [
                class "item-unit cy bold darker-row"
            ] [
                text "\u{03BC}s"
            ],
            div [
                class "item-desc cy darker-row"
            ] [
                text "(Min. step pulse interval)"
            ],
            div [
                class "item-err cy darker-row"
            ]
            (List.map errorItem model.minInterval_usec.errors),

        -- Step angle
            label [
                for "inputStepAngle",
                class "item-label cy bold"
            ]
            [
                text "\u{03B1}"
            ],
            input [
                type_ "text",
                id "inputStepAngle",
                class "item-input cy",
                value model.stepAngle_deg.str,
                onInput UpdateStepAngle
            ] [],
            div [
                class "item-unit cy bold"
            ] [
                text "°"
            ],
            div [
                class "item-desc cy"
            ] [
                text "(Step angle in degrees)"
            ],
            div [
                class "item-err"
            ]
            (List.map errorItem model.stepAngle_deg.errors),

        -- Timer frequency
            label [
                for "inputFreq",
                class "item-label cy bold darker-row"
            ] [
                text "f"
            ],
            input [
                type_ "text",
                id "inputFreq",
                class "item-input",
                value model.timerFrequency_mHz.str,
                onInput UpdateTimerFrequency
            ] [],
            div [
                class "item-unit cy bold darker-row"
            ] [
                text "MHz"
            ],
            div [
                class "item-desc cy darker-row"
            ] [
                text "(Step timer frequency)"
            ],
            div [
                class "item-err cy darker-row"
            ]
            (List.map errorItem model.timerFrequency_mHz.errors),

        -- Controls
            button [
                    type_ "button",
                    class "btn btn-light item-ctrl",
                    onClick CalculateRamp,
                    disabled (not (List.isEmpty (model.acceleration_radSec.errors ++ model.minInterval_usec.errors)))
                ] [
                    text "Generate ramp"
            ]
        ],
        div [
            hidden (not model.inProgress),
            class "top-offset-huge flex-column cy dark-text"
        ] [
            Loading.render
                Circle
                {
                    defaultConfig |
                        color = "#373a3e",
                        size = 50
                }
                Loading.On,
            div [] [
                text "Calculation in progress. Just a moment, please..."
            ]
        ],
        h4 [
            hidden (List.isEmpty model.delays),
            class "top-offset-large"
        ] [
            text "Acceleration ramp"
        ],
        div [
                class "flex-column darker",
                hidden (List.isEmpty model.delays)
            ] [
                LineChart.viewCustom {
                    x = Axis.default 3500 "Time (s)" .delayFromStart,
                    y = Axis.custom
                            { title = Title.atAxisMax 0 0 "\u{03C9} (RPM)"
                            , variable = Just << .angularSpeed
                            , pixels = 800
                            , range = Range.padded 20 20
                            , axisLine = AxisLine.full Colors.grayLightest
                            , ticks = Ticks.default
                            },
                    container = Container.custom {
                        attributesHtml = [ ],
                        attributesSvg = [ style "fill" "white" ],
                        margin = Container.Margin 100 100 100 100,
                        id = "chart1",
                        size = Container.relative
                    },
                    interpolation = Interpolation.default,
                    intersection = Intersection.default,
                    legends = Legends.none,
                    events = Events.default,
                    junk = Junk.default,
                    grid = Grid.default,
                    area = Area.default,
                    line = Line.wider 3,
                    dots = Dots.default
                }
                [
                    LineChart.line (Color.rgb255 222 255 0) Dots.none "Acceleration profile" model.ramp.graph
                ]
            ],
            div [
                class "grid-results darker",
                hidden (List.isEmpty model.delays)
            ] [

                -- Total ramp time
                div [
                    class "cy right-label"
                ] [
                    text "Ramp time"
                ],
                div [
                    class "cy bold darker-row"
                ] [
                    text ((Formatters.formatFloat 3 (List.sum model.delays / 1000000.0)) ++ " s")
                ],
                -- Max RPM
                div [
                    class "cy right-label"
                ] [
                    text "\u{03C9}",
                    sub [
                    ] [
                        text "max"
                    ]
                ],
                div [
                    class "cy bold darker-row"
                ] [
                    text ((Formatters.formatFloat 0 (
                    case (model.stepAngle_deg.val, model.minInterval_usec.val) of
                        (Just stepAngle_deg, Just minInterval_usec) ->
                            Stepper.speed_RPM (Conversions.degToRad stepAngle_deg) (Conversions.usecToSec minInterval_usec)
                        _ ->
                            0

                    )) ++ " RPM")
                ],

                -- No. of steps
                div [
                    class "cy right-label"
                ] [
                    text "Steps in ramp"
                ],
                div [
                    class "cy bold darker-row"
                ] [
                    text (String.fromInt (List.length model.delays))
                ]
            ],
            div [
                class "grid top-offset-medium",
                hidden (List.isEmpty model.delays)
            ] [
                -- Controls
                button [
                        type_ "button",
                        class "btn btn-dark item-ctrl",
                        onClick ToggleShowSteps
                    ] [
                        text (if model.showSteps then "Hide step values" else "Show step values")
                ]
            ],
            div [
                hidden (not model.showSteps),
                class "steps darker"
            ] [
                text ("const DELAYS = {" ++ (String.join ", " (List.map (Formatters.formatFloat 1) (model.delays))) ++ "};")
            ]
        ]



errorItem: String -> Html Msg
errorItem error =
    div [class "danger"] [
        i [class "bi-exclamation-triangle-fill right-offset-small"] [],
        text ("Check your input: " ++ error)
    ]


-- CALCULATIONS

calcRamp : Float -> Float -> Float -> Float  -> (List Float, Ramp)
calcRamp acceleration_radSec2 minStepInterval_usec stepAngle_deg timerFrequency_MHz =
    let
        timerFrequency_Hz =
            Conversions.mHzToHz timerFrequency_MHz

        stepAngle_rad =
            Conversions.degToRad stepAngle_deg

        delays_useconds =
            AccelRamp.rampIntervals acceleration_radSec2 stepAngle_rad timerFrequency_Hz minStepInterval_usec

        ramp =
            AccelRamp.intervalsToRampGraph stepAngle_rad timerFrequency_Hz delays_useconds
    in
        (delays_useconds, ramp)
