module Calculations.AccelRamp exposing (..)

import List.Extra as Extra
import Calculations.Stepper as Stepper exposing (..)
import Utils.Conversions as Conversions exposing (..)


type alias GraphPoint = {
        delayFromStart : Float,
        angularSpeed : Float
    }


type alias Ramp = {
        graph : List GraphPoint
    }


{-| Calculate ramp intervals in microseconds.
    Arguments:
        omegaPrime_radSec2: Angular acceleration in radians /sec^2
        alpha_rad: Step angle in radians
        f_Hz: Timer frequency in Hertz
        cMin_usec: Minimum step interval in microseconds
    Returns:
        Acceleration ramp intervals in microseconds
-}
rampIntervals : Float -> Float -> Float -> Float -> List Float
rampIntervals omegaPrime_radSec2 alpha_rad f_Hz cMin_usec =
        rampSteps omegaPrime_radSec2 alpha_rad f_Hz cMin_usec 0 0 []



{-| Recursively calculate ramp intervals in microseconds.
    Arguments:
        omegaPrime_radSec2: Angular acceleration in radians /sec^2
        alpha_rad: Step angle in radians
        f_Hz: Timer frequency in Hertz
        cMin_usec: Minimum step interval in microseconds
        cNm1_usec: Previous step interval in microseconds
        n: Zero-based Step number
    Returns:
        Acceleration ramp intervals in microseconds
-}
rampSteps : Float -> Float -> Float -> Float -> Float -> Int -> List Float -> List Float
rampSteps omegaPrime_radSec2 alpha_rad f_Hz cMin_usec cNm1_usec n steps =
    let
        cN =
            if n == 0 then
                0.676 * f_Hz * sqrt ((2 * alpha_rad) / omegaPrime_radSec2)
            else
                cNm1_usec - ((2 * cNm1_usec) / (4 * (toFloat n) + 1))
    in
        if cN <= cMin_usec then
            steps ++ [cMin_usec]
        else
            rampSteps omegaPrime_radSec2 alpha_rad f_Hz cMin_usec cN (n + 1) (steps ++ [cN])



{-| Convert step intervals to Ramp graph
    Arguments:
        alpha_rad: Step angle in radians
        f_Hz: Timer frequency in Hertz
        intervals_usec: List of step intervals in microseconds
    Returns:
        Ramp graph data
-}
intervalsToRampGraph : Float -> Float -> List Float -> Ramp
intervalsToRampGraph alpha_rad f_Hz intervals_usec =
    let
        timeOffsets_usec =
            toAbsoluteOffsets intervals_usec 0 []

        angularSpeeds_radsec =
            List.map (\delay_usec ->
                Conversions.usecToSec delay_usec
                    |>  Stepper.speed_RadSec alpha_rad f_Hz) intervals_usec

        timeOffsets_sec =
            List.map(\delay_usec ->
                Conversions.usecToSec delay_usec) timeOffsets_usec

        angularSpeeds_rpm =
            List.map (Conversions.radSecToRPM) angularSpeeds_radsec


    in
    {
        graph = List.map (\(x,y) -> {
            delayFromStart = x,
            angularSpeed = y
        }) (Extra.zip timeOffsets_sec angularSpeeds_rpm)
    }



{-| Recursively add relative step intervals to absolute time offsets
    Arguments:
        absoluteIntervals: List of relative time intervals
        offsetSoFar: ongoing offset value
        offsetsFromStart: ongoing offset list
    Returns:
        Absolute time offsets
-}
toAbsoluteOffsets : List Float -> Float -> List Float -> List Float
toAbsoluteOffsets absoluteIntervals offsetSoFar offsetsFromStart =
    let
        nextValue : Maybe (Float)
        nextValue =
            List.head absoluteIntervals

        restOfIntervals : Maybe (List Float)
        restOfIntervals =
            List.tail absoluteIntervals

        currentOffset : Float
        currentOffset =
            case nextValue of
                Just a ->
                    offsetSoFar + a
                Nothing ->
                    offsetSoFar
    in
        case restOfIntervals of
            Just intervals ->
                toAbsoluteOffsets intervals currentOffset (offsetsFromStart ++ [currentOffset])
            Nothing ->
                offsetsFromStart ++ [currentOffset]
