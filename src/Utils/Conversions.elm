module Utils.Conversions exposing (..)

r_MHZ_TO_HZ : Float
r_MHZ_TO_HZ =
    1000000

r_DEG_TO_RAD : Float
r_DEG_TO_RAD =
    (pi / 180)

r_DEGSEC_TO_RADSEC : Float
r_DEGSEC_TO_RADSEC =
    0.0174532925

r_MIN_TO_SEC : Float
r_MIN_TO_SEC =
    60

r_SEC_TO_USEC : Float
r_SEC_TO_USEC =
    1000000

r_CIRCLE_TO_DEGREES : Float
r_CIRCLE_TO_DEGREES =
    360



{-| Converts frequency value from MHz to Hz
    Arguments:
        mHz: Frequency value in MHz
    Returns:
        Frequency value in Hz
-}
mHzToHz : Float -> Float
mHzToHz mHz =
    mHz * r_MHZ_TO_HZ



{-| Converts frequency value from Hz to MHz
    Arguments:
        hz: Frequency value in Hz
    Returns:
        Frequency value in MHz
-}
--noinspection ElmUnusedSymbol
hzToMHz : Float -> Float
hzToMHz hz =
    hz * (1 / r_MHZ_TO_HZ)



{-| Converts angle value from degrees to radians
    Arguments:
        deg: Angle value in degrees
    Returns:
        Angle value in radians
-}
degToRad : Float -> Float
degToRad deg =
    deg * r_DEG_TO_RAD



{-| Converts angle value from radians to degrees
    Arguments:
        rad: Angle value in radians
    Returns:
        Angle value in degrees
-}
radToDeg : Float -> Float
radToDeg rad =
    rad / r_DEG_TO_RAD



{-| Converts angular speed from radians/sec to degrees/sec
    Arguments:
        radSec: Angular speed in radians/sec
    Returns:
        Angular speed in degrees/sec
-}
radSecToDegSec : Float -> Float
radSecToDegSec radSec =
    radSec / r_DEGSEC_TO_RADSEC


radSecToRPM radSec =
    let
        degSec =
            radSecToDegSec radSec
    in
        (degSec * r_MIN_TO_SEC) / r_CIRCLE_TO_DEGREES



{-| Converts angular speed from degrees/sec to radians/sec
    Arguments:
        degSec: Angular speed in degrees/sec
    Returns:
        Angular speed in radians/sec
-}
--noinspection ElmUnusedSymbol
degSecToRadSec : Float -> Float
degSecToRadSec degSec =
    degSec * r_DEGSEC_TO_RADSEC



{-| Converts time value from seconds to microseconds
    Arguments:
        sec: Time value in seconds
    Returns:
        Time value in microseconds
-}
secToUsec : Float -> Float
secToUsec sec =
    sec * r_SEC_TO_USEC



{-| Converts time value from microseconds to seconds
    Arguments:
        usec: Time value in microseconds
    Returns:
        Time value in seconds
-}
usecToSec : Float -> Float
usecToSec usec =
    usec / r_SEC_TO_USEC
