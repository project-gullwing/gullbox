module Page.Resolution exposing (..)

import Html exposing (..)
import Html.Events exposing (..)


-- MODEL


type alias Model = Int


init : () -> ( Model, Cmd Msg )
init _ =
  (0, Cmd.none)



-- UPDATE


type Msg
  = Increment
  | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Increment ->
      ( model + 1, Cmd.none)

    Decrement ->
      ( model - 1, Cmd.none)



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
