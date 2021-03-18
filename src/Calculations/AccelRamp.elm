module Calculations.AccelRamp exposing (..)

import List.Extra as Extra

type alias GraphPoint = {
        delayFromStart : Float,
        angularSpeed : Float
    }

type alias Ramp = {
        graph : List GraphPoint
    }

calculateDelays : Float -> Float -> Float -> Float -> List Float
calculateDelays omegaPrime_radSec2 cMin stepAngle_deg f_Hz =
    let
        stepAngle_rad =
            stepAngle_deg * (pi / 180)
    in
        calculateDelayStep 0 f_Hz stepAngle_rad omegaPrime_radSec2 0 cMin []


calculateDelayStep : Int -> Float -> Float -> Float -> Float -> Float -> List Float -> List Float
calculateDelayStep n f_Hz alpha_rad omegaPrime_radSec2 cNm1 cMin steps =
    let
        cN =
            if n == 0 then
                0.676 * f_Hz * sqrt ((2 * alpha_rad) / omegaPrime_radSec2)
            else
                cNm1 - ((2 * cNm1) / (4 * (toFloat n) + 1))
    in
        if cN <= cMin then
            steps ++ [cMin]
        else
            calculateDelayStep (n + 1) f_Hz alpha_rad omegaPrime_radSec2 cN cMin (steps ++ [cN])


delaysToRamp : Float -> Float -> List Float -> Ramp
delaysToRamp stepAngle_rad f_Hz delays =
    let
        delaysFromStart =
            calcDelaysFromStart 0 delays []

        angularSpeedsFromStart =
            List.map (\x -> calcAngularSpeed stepAngle_rad f_Hz x) delays


    in
    {
        graph = List.map (\(x,y) -> {delayFromStart = x / 1000000, angularSpeed = (y / 0.0174532925) / 360}) (Extra.zip delaysFromStart angularSpeedsFromStart)
    }


calcDelaysFromStart : Float -> List Float -> List Float -> List Float
calcDelaysFromStart delaySoFar delays delaysFromStart =
    let
        nextValue : Maybe (Float)
        nextValue =
            List.head delays

        restOfValues : Maybe (List Float)
        restOfValues =
            List.tail delays

        currentValue : Float
        currentValue =
            case nextValue of
                Just a ->
                    delaySoFar + a
                Nothing ->
                    delaySoFar
    in
        case restOfValues of
            Just a ->
                calcDelaysFromStart currentValue a (delaysFromStart ++ [currentValue])
            Nothing ->
                delaysFromStart ++ [currentValue]




calcAngularSpeed : Float -> Float -> Float -> Float
calcAngularSpeed stepAngle_rad f_Hz c =
    (stepAngle_rad * f_Hz) / c

