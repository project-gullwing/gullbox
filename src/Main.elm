module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url
import Url.Parser as UP exposing ((</>))

import Page.Acceleration as PG_ACC exposing (Model, Msg, init, update)
import Page.Resolution as PG_RES exposing (Model, Msg, init, update)
import Page.Precision as PG_PRE exposing (Model, Msg, init, update)
import Debug exposing (log)

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


--- PAGES

type Page
    = PageAcceleration PG_ACC.Model
    | PageResolution PG_RES.Model
    | PagePrecision PG_PRE.Model


--- ROUTES

type Route
    = RouteAcceleration
    | RouteResolution
    | RoutePrecision

routeParser : UP.Parser (Route -> a) a
routeParser =
    UP.oneOf [
        UP.map RouteResolution (UP.s "resolution"),
        UP.map RoutePrecision (UP.s "precision")
    ]


urlToRoute : Url.Url -> Route
urlToRoute url =
    Maybe.withDefault RouteAcceleration (UP.parse routeParser url)




-- MODEL


type alias Model = {
    key : Nav.Key,
    url : Url.Url,
    route: Route,
    page: Page
  }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        (pageModel, pageCmds) =
            PG_ACC.init ()

        model = {
                key = key,
                url = url,
                route = urlToRoute url,
                page = PageAcceleration pageModel
            }
    in
    initCurrentPage ( model, Cmd.none )


initCurrentPage : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
initCurrentPage ( model, existingCmds ) =
    let
        ( currentPage, mappedPageCmds ) =
            case model.route of
                RouteAcceleration ->
                    let
                        ( pageModel, pageCmds ) =
                            PG_ACC.init ()
                    in
                    ( PageAcceleration pageModel, Cmd.map AccelerationMsg pageCmds )

                RouteResolution ->
                    let
                        ( pageModel, pageCmds ) =
                            PG_RES.init ()
                    in
                    ( PageResolution pageModel, Cmd.map ResolutionMsg pageCmds )

                RoutePrecision ->
                    let
                        ( pageModel, pageCmds ) =
                            PG_PRE.init ()
                    in
                    ( PagePrecision pageModel, Cmd.map PrecisionMsg pageCmds )

    in
    (
        {
            model | page = currentPage
        },
        Cmd.batch [ existingCmds, mappedPageCmds ]
    )



-- UPDATE


type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | AccelerationMsg PG_ACC.Msg
  | ResolutionMsg PG_RES.Msg
  | PrecisionMsg PG_PRE.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =

  case ({--Debug.log "update"--} msg, model.page) of

    (LinkClicked urlRequest, _) ->
      case urlRequest of
        Browser.Internal url ->
          ( model, Nav.pushUrl model.key (Url.toString url) )

        Browser.External href ->
          ( model, Nav.load href )

    (UrlChanged url, _) ->
        initCurrentPage ( { model | url = url, route = urlToRoute url }, Cmd.none)

    (AccelerationMsg subMsg, PageAcceleration subModel) ->
        let
            ( updatedPageModel, updatedCmd ) =
                    PG_ACC.update subMsg subModel
        in
            (
                {
                    model | page = PageAcceleration updatedPageModel
                },
                Cmd.map AccelerationMsg updatedCmd
            )

    (ResolutionMsg subMsg, PageResolution subModel) ->
        let
            ( updatedPageModel, updatedCmd ) =
                    PG_RES.update subMsg subModel
        in
            (
                {
                    model | page = PageResolution updatedPageModel
                },
                Cmd.map ResolutionMsg updatedCmd
            )

    (PrecisionMsg subMsg, PagePrecision subModel) ->
        let
            ( updatedPageModel, updatedCmd ) =
                    PG_PRE.update subMsg subModel
        in
            (
                {
                    model | page = PagePrecision updatedPageModel
                },
                Cmd.map PrecisionMsg updatedCmd
            )

    ( _, _ ) ->
        ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none




-- VIEW


view : Model -> Browser.Document Msg
view model =
    let
        page =
            case {--Debug.log "view"--} model.page of
                PageAcceleration pageModel ->
                    PG_ACC.view pageModel
                        |> Html.map AccelerationMsg

                PageResolution pageModel ->
                    PG_RES.view pageModel
                        |> Html.map ResolutionMsg

                PagePrecision pageModel ->
                    PG_PRE.view pageModel
                        |> Html.map PrecisionMsg

    in
  { title = "Gullwing toolbox"
  , body = [
        nav [class "navbar navbar-expand-lg navbar-dark bg-dark" ] [
            div [class "container-fluid"] [
                span [class "navbar-brand mb-0 h1"] [
                    text "Gullwing toolbox"
                ],
                div [class "collapse navbar-collapse", id "navbarSupportedContent"] [
                    ul [class "navbar-nav me-auto mb-2 mb-lg-0"] [
                        viewLink "acceleration" "Acceleration" RouteAcceleration model.route,
                        viewLink "resolution" "Resolution" RouteResolution model.route,
                        viewLink "precision" "Precision" RoutePrecision model.route
                    ]
                ]
            ]
        ],
        div [class "workspace"] [
            page
        ]
    ]
  }


viewLink : String -> String -> Route -> Route -> Html msg
viewLink path title route activeRoute =
    li [class "nav-item"] [
    a [
        href path,
        classList [
            ("nav-link", True),
            ("active", (activeRoute == route))
        ]
    ] [ text title ] ]


