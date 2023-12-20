import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ChooseTeamScreen from "../screens/ChooseTeamScreen";
import CreateMeetingScreen from "../screens/CreateMeetingScreen";
import CreateTeamScreen from "../screens/CreateTeamScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import EnterHouseScreen from "../screens/EnterHouseScreen";
import InviteUserToMeetingScreen from "../screens/InviteUsersToMeetingScreen";
import JoinTeamScreen from "../screens/JoinTeamScreen";
import SignInScreen from "../screens/SignInScreen";

export type RootStackParamList = {
  SignIn: undefined;
  CreateUser: undefined;
  CreateTeam: undefined;
  JoinTeam: undefined;
  ChooseTeam: undefined;
  EnterHouse: undefined;
  MeetingRoom: undefined;
  ChatRoom: undefined;
  CreateMeeting: undefined;
  InviteUserToMeeting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateUser"
          options={{ headerShown: false }}
          component={CreateUserScreen}
        />
        <Stack.Screen
          name="CreateTeam"
          options={{ headerShown: false }}
          component={CreateTeamScreen}
        />
        <Stack.Screen
          name="JoinTeam"
          options={{ headerShown: false }}
          component={JoinTeamScreen}
        />
        <Stack.Screen
          name="ChooseTeam"
          options={{ headerShown: false }}
          component={ChooseTeamScreen}
        />
        <Stack.Screen
          name="EnterHouse"
          options={{ headerShown: false }}
          component={EnterHouseScreen}
        />
        <Stack.Screen
          name="ChatRoom"
          options={{ headerShown: false }}
          component={ChatRoomScreen}
        />
        <Stack.Screen
          name="CreateMeeting"
          options={{ headerShown: false }}
          component={CreateMeetingScreen}
        />
        <Stack.Screen
          name="InviteUserToMeeting"
          options={{ headerShown: false }}
          component={InviteUserToMeetingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
