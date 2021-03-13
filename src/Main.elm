module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url
import Url.Parser as UP exposing ((</>))

-- MAIN

main : Program () Model Msg
main =
    Browser.application {
        init = init,
        view = view,
        update = update,
        subscriptions = subscriptions,
        onUrlChange = UrlChanged,
        onUrlRequest = LinkClicked
    }

--- ROUTES

type Route
    = AccelRamp
    | Resolution
    | Precision

routeParser : UP.Parser (Route -> a) a
routeParser =
    UP.oneOf [
        UP.map Resolution (UP.s "resolution"),
        UP.map Precision (UP.s "precision")
    ]


urlToRoute : Url.Url -> Route
urlToRoute url =
    Maybe.withDefault AccelRamp (UP.parse routeParser url)




-- MODEL


type alias Model = {
    key : Nav.Key,
    url : Url.Url,
    route: Route
  }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
      ( { key = key
        , url = url
        , route = urlToRoute url
        }
      , Cmd.none
      )




-- UPDATE


type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    LinkClicked urlRequest ->
      case urlRequest of
        Browser.Internal url ->
          ( model, Nav.pushUrl model.key (Url.toString url) )

        Browser.External href ->
          ( model, Nav.load href )

    UrlChanged url -> ( {model | url = url, route = urlToRoute url}, Cmd.none)




-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none




-- VIEW


view : Model -> Browser.Document Msg
view model =
    let
        page =
            case model.route of
                AccelRamp ->
                    pageAccelRamp

                Precision ->
                    pagePrecision

                Resolution ->
                    pageResolution
    in
  { title = "Gullwing helper"
  , body = [
        nav [class "navbar navbar-expand-lg navbar-dark bg-dark" ] [
            div [class "container-fluid"] [
                span [class "navbar-brand mb-0 h1"] [
                    text "Gullwing helper"
                ],
                div [class "collapse navbar-collapse", id "navbarSupportedContent"] [
                    ul [class "navbar-nav me-auto mb-2 mb-lg-0"] [
                        viewLink "/accelramp" "Acceleration" AccelRamp model.route,
                        viewLink "/resolution" "Resolution" Resolution model.route,
                        viewLink "/precision" "Precision" Precision model.route
                    ]
                ]
            ]
        ],
        div []  page.content
    ]
  }


viewLink : String -> String -> Route -> Route -> Html msg
viewLink path title route activeRoute =
    li [class "nav-item"] [
    a [
        href path,
        classList [
            ("nav-link", True),
            ("nav-active", (activeRoute == route))
        ]
    ] [ text title ] ]


-- PAGE

type alias Page msg = {
        title : String,
        content : List (Html msg)
    }

pageAccelRamp : Page msg
pageAccelRamp = {
        title = "Drive acceleration ramp",
        content = [
            text "Drive acceleration ramp"
        ]
    }

pageResolution : Page msg
pageResolution = {
        title = "Drive Resolution",
        content = [
            text "Drive Resolution"
        ]
    }

pagePrecision : Page msg
pagePrecision = {
        title = "Drive Precision",
        content = [
            text "Drive Precision"
        ]
    }
