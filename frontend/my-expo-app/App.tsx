import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";
import "nativewind";

// @ts-expect-error
const App = () => <ExpoRoot context={require.context("./app")} />;

export default registerRootComponent(App);