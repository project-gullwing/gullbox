module Calculations.Stepper exposing (..)


import Utils.Conversions as Conversions exposing (..)

{-| Calculate the stepper speed in radians/sec from step interval and angle.
    Arguments:
        alpha_rad: Step angle in radians
        f_Hz: Timer frequency in Hertz
        c_sec: Step interval in seconds
    Returns:
        Calculate the stepper speed in radians/sec
-}
speed_RadSec : Float -> Float -> Float -> Float
speed_RadSec alpha_rad f_Hz c_sec =
    let
        stepInterval_microsec =
            Conversions.secToUsec c_sec
    in
        (alpha_rad * f_Hz) / stepInterval_microsec


{-| Calculate the stepper speed in RPM from step interval and angle.
    Arguments:
        alpha_rad: Step angle in radians
        c_sec: Step interval in seconds
    Returns:
        Stepper speed in RPM
-}
speed_RPM : Float -> Float -> Float
speed_RPM alpha_rad c_sec =
    let
        stepAngle_deg =
            Conversions.radToDeg alpha_rad
        stepCount =
            1 / c_sec
    in
        (stepCount * stepAngle_deg * r_MIN_TO_SEC) / r_CIRCLE_TO_DEGREES
