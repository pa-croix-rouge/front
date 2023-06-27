import { mode } from "@chakra-ui/theme-tools";
export const buttonStyles = {
  components: {
    Button: {
      variants: {
        primary: {
          fontSize: "10px",
          bg: "orange.400",
          color: "#fff",
          _hover: { bg: "orange.300" },
          _focus: { bg: "orange.300" },
          _active: { bg: "orange.300" },
        },
        navy: {
          fontSize: "10px",
          bg: "navy.900",
          color: "#fff",
          _hover: { bg: "navy.900" },
          _focus: { bg: "navy.900" },
          _active: { bg: "navy.900" },
        },
        "no-effects": {
          _hover: "none",
          _active: "none",
          _focus: "none",
        },
        danger: () => ({
          color: "white",
          bg: "red.500",
          fontSize: "10px",
          _hover: "red.400",
          _focus: "red.400",
          _active: "red.400",
        }),
        outlined: (props) => ({
          color: mode("orange.400", "white")(props),
          bg: "transparent",
          fontSize: "10px",
          border: "1px solid",
          borderColor: { bg: mode("orange.400", "white")(props)},
          _hover: { bg: mode("orange.50", "transparent")(props) },
          _focus: { bg: mode("orange.50", "transparent")(props) },
          _active: { bg: mode("orange.50", "transparent")(props) },
        }),
        dark: (props) => ({
          color: "white",
          bg: mode("gray.700", "blue.500")(props),
          fontSize: "10px",
          _hover: { bg: mode("gray.700", "blue.500")(props) },
          _focus: { bg: mode("gray.700", "blue.600")(props) },
          _active: { bg: mode("gray.700", "blue.400")(props) },
        }),
        light: (props) => ({
          color: mode("gray.700", "gray.700")(props),
          bg: mode("gray.100", "white")(props),
          fontSize: "10px",
          _hover: { bg: mode("gray.50", "white")(props) },
          _focus: { bg: mode("gray.50", "white")(props) },
          _active: { bg: mode("gray.50", "white")(props) },
        }),
      },
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "8px",
        fontSize: "10px",
      },
    },
  },
};
