module Utils.Formatters exposing (..)


import FormatNumber exposing (format)
import FormatNumber.Locales exposing (Decimals(..), frenchLocale)


formatFloat: Int -> Float -> String
formatFloat decimalPlaces x =
    format { frenchLocale |
                decimals = Exact decimalPlaces,
                decimalSeparator = "."
            } x

formatFloatNoThousands: Int -> Float -> String
formatFloatNoThousands decimalPlaces x =
    format { frenchLocale |
                decimals = Exact decimalPlaces,
                decimalSeparator = ".",
                thousandSeparator = ""
            } x
