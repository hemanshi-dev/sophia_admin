import { configureStore } from "@reduxjs/toolkit";
import {
  AddCompanion_reducer,
  GetAllCompanions_reducer,
  UpdateCompanion_reducer,
  Auth_reducer,
  DeleteCompanion_reducer,
  SearchUsers_reducer,
  GetAllUsers_reducer,
  AddReel_reducer,
  UpdateReel_reducer,
  GetAllReels_reducer,
  GetAllFeedback_reducer,
  GetAllReelReport_reducer,
  Gallery_reducer,
  LiveMode_reducer,
} from "./reducer/useReducer";

const store = configureStore({
  reducer: {
    companion: AddCompanion_reducer,
    companions_list: GetAllCompanions_reducer,
    update_companion: UpdateCompanion_reducer,
    auth: Auth_reducer,
    delete_companion: DeleteCompanion_reducer,
    search_users: SearchUsers_reducer,
    users_list: GetAllUsers_reducer,
    reel: AddReel_reducer,
    update_reel: UpdateReel_reducer,
    reels_list: GetAllReels_reducer,
    feedback_list: GetAllFeedback_reducer,
    reel_report_all: GetAllReelReport_reducer,
    gallery: Gallery_reducer,
    live_mode: LiveMode_reducer,
  },
});

export default store;
