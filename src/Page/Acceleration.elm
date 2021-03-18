module Page.Acceleration exposing (..)

import Browser.Dom exposing (Error)
import Calculations.AccelRamp as AccelRamp exposing (Ramp)
import FormatNumber exposing (format)
import FormatNumber.Locales exposing (Decimals(..), frenchLocale)
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


-- MODEL

type alias Point =
  { x : Float, y : Float }

type alias FloatValue = {
        str : String,
        val : Maybe Float,
        errors : List String
    }

type alias Model = {
        acceleration : FloatValue,
        minInterval : FloatValue,
        stepAngle : FloatValue,
        timerFrequency : FloatValue,
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
        acceleration = validateAcceleration "35.0",
        minInterval = validateMinInterval "300.0",
        stepAngle = validateStepAngle "1.8",
        timerFrequency = validateTimerFrequency "1",
        delays = [],
        ramp = {
            graph = []
        },
        showSteps = False,
        inProgress = False
    },
    Cmd.none)



-- UPDATE

calc : Float -> Float -> Float -> Float  -> (List Float, Ramp)
calc accel cMin stepAngle freq =
    let
        mHzToHz
            = 1000000

        frequency_Hz =
            freq * mHzToHz

        delays =
            AccelRamp.calculateDelays accel cMin stepAngle frequency_Hz

        ramp =
            AccelRamp.delaysToRamp stepAngle frequency_Hz delays
    in
        (delays, ramp)

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
    let
        mHzToHz = 1000000
    in
        case msg of
            UpdateAcceleration value ->
              ( {model | acceleration = validateAcceleration value}, Cmd.none)

            UpdateMinInterval value ->
              ( {model | minInterval = validateMinInterval value}, Cmd.none)

            UpdateStepAngle value ->
              ( {model | stepAngle = validateStepAngle value}, Cmd.none)

            UpdateTimerFrequency value ->
              ( {model | timerFrequency = validateTimerFrequency value}, Cmd.none)

            CalculateRamp ->
                case [model.acceleration.val, model.minInterval.val, model.stepAngle.val, model.timerFrequency.val] of
                    [Just acceleration, Just minInterval, Just stepAngle, Just frequency] ->
                        ( {model |
                            inProgress = True,
                            delays = [],
                            ramp = {
                                graph = []
                            }
                        },
                        Process.sleep 100 |> Task.perform (\_ -> RampReceived (calc acceleration minInterval stepAngle frequency)))
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
                value model.acceleration.str,
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
            (List.map errorItem model.acceleration.errors),

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
                value model.minInterval.str,
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
            (List.map errorItem model.minInterval.errors),

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
                value model.stepAngle.str,
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
            (List.map errorItem model.stepAngle.errors),

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
                value model.timerFrequency.str,
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
            (List.map errorItem model.timerFrequency.errors),

        -- Controls
            button [
                    type_ "button",
                    class "btn btn-light item-ctrl",
                    onClick CalculateRamp,
                    disabled (not (List.isEmpty (model.acceleration.errors ++ model.minInterval.errors)))
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
                    --y = Axis.default 800 "Motor speed (RPM)" .angularSpeed,
                    y = Axis.custom
                            { title = Title.atAxisMax 60 0 "Motor speed (RPM)"
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
                    text ((format { frenchLocale | decimals = Exact 3, decimalSeparator = "." } (List.sum model.delays / 1000000.0)) ++ " s")
                ],
                -- Max RPM
                div [
                    class "cy right-label"
                ] [
                    text "RPM",
                    sub [
                    ] [
                        text "max"
                    ]
                ],
                div [
                    class "cy bold darker-row"
                ] [
                    text ((format { frenchLocale | decimals = Exact 0, decimalSeparator = "." } (
                    case (model.minInterval.val, model.stepAngle.val) of
                        (Just a, Just b) ->
                            ((1000000 / a) * b * 60) / 360
                        _ ->
                            0

                    )))
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
                text ("const DELAYS = {" ++ (String.join ", " (List.map formatDelay (model.delays))) ++ "};")
            ]
        ]

formatDelay: Float -> String
formatDelay x =
    format { frenchLocale | decimals = Exact 1, decimalSeparator = "." } x

errorItem: String -> Html Msg
errorItem error =
    div [class "danger"] [
        i [class "bi-exclamation-triangle-fill right-offset-small"] [],
        text ("Check your input: " ++ error)
    ]



-- VALIDATION

validateAcceleration : String -> FloatValue
validateAcceleration strInput =
    let
        (value, errors, _) =
            ("\u{03C9}\u{2032}", strInput)
                |> parseFloat
                |> checkRange 10 500
    in
    {str = strInput, val = value, errors = errors}


validateMinInterval : String -> FloatValue
validateMinInterval strInput =
    let
        (value, errors, _) =
            ("cMin", strInput)
                |> parseFloat
                |> checkRange 300 1000
    in {str = strInput, val = value, errors = errors}


validateStepAngle : String -> FloatValue
validateStepAngle strInput =
    let
        (value, errors, _) =
            ("\u{03B1}", strInput)
                |> parseFloat
                |> checkRange 0.1 360
    in {str = strInput, val = value, errors = errors}


validateTimerFrequency : String -> FloatValue
validateTimerFrequency strInput =
    let
        (value, errors, _) =
            ("f", strInput)
                |> parseFloat
                |> checkRange 0.1 10
    in {str = strInput, val = value, errors = errors}


parseFloat : (String, String) -> (Maybe Float, List String, String)
parseFloat (paramName, strInput) =
    let
        floatValue = String.toFloat strInput
    in
        case floatValue of
            Just val ->
                (Just val, [], paramName)
            Nothing ->
                (Nothing, [paramName ++ " must be a number"], paramName)


checkRange : Float -> Float -> (Maybe Float, List String, String) -> (Maybe Float, List String, String)
checkRange min max (value, errors, paramName) =
    case value of
        Just val ->
            if ((val >= min) && (val <= max)) then
                (Just val, errors, paramName)
            else
                (Nothing, (paramName ++ " must be between " ++ String.fromFloat min ++ " ... " ++ String.fromFloat max) :: errors, paramName)

        Nothing ->
            (Nothing, errors, paramName)
