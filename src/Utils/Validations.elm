module Utils.Validations exposing (..)

import Tuple exposing (first, second)


type alias MinMax =
    (Float, Float)


type alias FloatValue = {
        str : String,
        val : Maybe Float,
        errors : List String
    }


validateFloatValue : String -> String -> MinMax -> FloatValue
validateFloatValue strInput valLabel valMinMax =
    let
        (value, errors, _) =
            (valLabel, strInput)
                |> checkFloat
                |> checkRange valMinMax
    in {str = strInput, val = value, errors = errors}



checkFloat : (String, String) -> (Maybe Float, List String, String)
checkFloat (paramName, strInput) =
    let
        floatValue =
            String.toFloat strInput
    in
        case floatValue of
            Just val ->
                (Just val, [], paramName)
            Nothing ->
                (Nothing, [paramName ++ " must be a number"], paramName)


checkRange : MinMax -> (Maybe Float, List String, String) -> (Maybe Float, List String, String)
checkRange minMax (value, errors, paramName) =
    let
        min =
            first minMax
        max =
            second minMax
    in
        case value of
            Just val ->
                if ((val >= min) && (val <= max)) then
                    (Just val, errors, paramName)
                else
                    (Nothing, (paramName ++ " must be between " ++ String.fromFloat min ++ " ... " ++ String.fromFloat max) :: errors, paramName)

            Nothing ->
                (Nothing, errors, paramName)
