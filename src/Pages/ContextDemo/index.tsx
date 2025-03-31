import { createElement, useContext } from "../../../lib/react";
import createContext from "../../../lib/react/context";
import { REACT_FRAGMENT_TYPE } from "../../../lib/share/ReactSymbols";

const Context1 = createContext<string>("CONTEXT_1_INIT_VALUE");
const Context2 = createContext<string>("CONTEXT_2_INIT_VALUE");
const Context3 = createContext<string>("CONTEXT_3_INIT_VALUE");

function ContextReader({ title }: { title: string }) {
  const context1Value = useContext(Context1);
  const context2Value = useContext(Context2);
  const context3Value = useContext(Context3);

  return createElement(
    "div",
    {
      style: {
        border: "1px solid black",
        height: "100px",
      },
    },
    [
      createElement(
        "h3",
        {
          style: {
            color: "black",
            textAlign: "center",
          },
        },
        [title]
      ),
      createElement(
        "div",
        {
          style: {
            color: "green",
          },
        },
        [`Context1 value=${context1Value}`]
      ),
      createElement(
        "div",
        {
          style: {
            color: "blue",
          },
        },
        [`Context2 value=${context2Value}`]
      ),
      createElement(
        "div",
        {
          style: {
            color: "yellow",
          },
        },
        [`Context3 value=${context3Value}`]
      ),
    ]
  );
}

export default function ContextDemo() {
  return createElement(REACT_FRAGMENT_TYPE, {}, [
    createElement(
      "div",
      {
        style: { backgroundColor: "pink", width: "600px" },
      },
      [
        createElement(ContextReader, {
          title: "最外层Context结果",
        }),
        createElement(
          "div",
          {
            style: { backgroundColor: "lightblue", width: "550px" },
          },
          [
            createElement(
              "h3",
              {
                style: {
                  color: "white",
                  textAlign: "center",
                },
              },
              "Provider1"
            ),
            createElement(
              Context1.Provider,
              {
                value: "PROVIDER1 NEW VALUE",
              },
              [
                createElement(ContextReader, {
                  title: "Provider1内层Context结果",
                }),
                createElement(
                  "div",
                  {
                    style: { backgroundColor: "lightgray", width: "500px" },
                  },
                  [
                    createElement(
                      "h3",
                      {
                        style: {
                          color: "white",
                          textAlign: "center",
                        },
                      },
                      "Provider2"
                    ),
                    createElement(
                      Context2.Provider,
                      {
                        value: "PROVIDER2 NEW VALUE",
                      },
                      [
                        createElement(ContextReader, {
                          title: "Provider1内层Context结果",
                        }),
                        createElement(
                          "div",
                          {
                            style: {
                              backgroundColor: "lightgreen",
                              width: "400px",
                            },
                          },
                          [
                            createElement(
                              "h3",
                              {
                                style: {
                                  color: "white",
                                  textAlign: "center",
                                },
                              },
                              "Provider3"
                            ),
                            createElement(
                              Context3.Provider,
                              {
                                value: "PROVIDER3 NEW VALUE",
                              },
                              [
                                createElement(ContextReader, {
                                  title: "最内层Context结果",
                                }),
                              ]
                            ),
                          ]
                        ),
                      ]
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]
    ),
  ]);
}
