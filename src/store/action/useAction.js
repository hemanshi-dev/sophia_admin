import apiClient, { handleRequest } from "../../utils/api";
import * as types from "./types";

/**
 * COMPANION ACTIONS
 */

export function AddCompanionData(formData, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post("/auth/upload", formData), setLoading);
      dispatch({ type: types.ADD_COMPANION_DATA, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export function GetAllCompanions(setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get("/auth/admin/images"), setLoading);
      dispatch({ type: types.GET_ALL_COMPANIONS, payload: data.images });
      return data.images;
    } catch (error) { throw error; }
  };
}

export function UpdateCompanionData(id, formData, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.put(`/auth/upload/edit/${id}`, formData), setLoading);
      dispatch({ type: types.UPDATE_COMPANION_DATA, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export const resetAddCompanion = () => ({ type: types.RESET_ADD_COMPANION });
export const resetUpdateCompanion = () => ({ type: types.RESET_UPDATE_COMPANION });

export function DeleteCompanion(id, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.delete(`/auth/upload/delete/${id}`), setLoading);
      dispatch({ type: types.DELETE_COMPANION, payload: { id, data } });
      return data;
    } catch (error) { throw error; }
  };
}

export function UpdateCompanionOrder(id, direction, setLoading) {
  return async () => {
    try {
      return await handleRequest(apiClient.post(`/auth/epoch/adjust/${id}`, { direction }), setLoading);
    } catch (error) { throw error; }
  };
}

export function EyeShowAction(id, fallback, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post(`/auth/admin/images/eyeshow/${id}`, { fallback }), setLoading);
      dispatch({ type: types.EYESHOW_COMPANION, payload: { id, fallback, data } });
      return data;
    } catch (error) { throw error; }
  };
}

/**
 * AUTH & USER ACTIONS
 */

export function LoginUser(credentials, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post("/auth/login", credentials), setLoading);
      dispatch({ type: types.LOGIN_USER, payload: data });
      
      if (data.success && data.access_token) {
        localStorage.setItem("authorization", data.access_token);
      }
      return data;
    } catch (error) { throw error; }
  };
}

export function SearchUsers(query, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get(`/auth/search?q=${encodeURIComponent(query)}`), setLoading);
      dispatch({ type: types.SEARCH_USERS, payload: data.users || data });
      return data;
    } catch (error) { throw error; }
  };
}

export function GetAllUsers(setLoading, offset = 0) {
  return async (dispatch) => {
    try {
      const url = offset === 0 ? "/auth/userlist?limit=0" : `/auth/userlist?limit=${offset}&has_next=true`;
      const data = await handleRequest(apiClient.get(url), setLoading);
      dispatch({
        type: offset === 0 ? types.GET_ALL_USERS : types.GET_MORE_USERS,
        payload: { ...data, offset }
      });
      return data;
    } catch (error) { throw error; }
  };
}

/**
 * REEL ACTIONS
 */

export function AddReelAction(formData, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post("/chat/reel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }), setLoading);
      dispatch({ type: types.ADD_REEL_DATA, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export const resetAddReel = () => ({ type: types.RESET_ADD_REEL });

export function UpdateReelAction(id, formData, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.put(`/chat/reel/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }), setLoading);
      dispatch({ type: types.UPDATE_REEL_DATA, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export const resetUpdateReel = () => ({ type: types.RESET_UPDATE_REEL });

export function GetAllReels(setLoading) {
  return async (dispatch) => {
    try {
      const raw = await handleRequest(apiClient.get("/chat/reel/all"), setLoading);
      const reels = Array.isArray(raw) ? raw : (raw?.reels || raw?.data || []);
      dispatch({ type: types.GET_ALL_REELS, payload: reels });
      return reels;
    } catch (error) { throw error; }
  };
}

export function DeleteReelAction(id, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.delete(`/chat/reel/${id}`), setLoading);
      dispatch({ type: types.DELETE_REEL, payload: { id, data } });
      return data;
    } catch (error) { throw error; }
  };
}

export function UpdateReelOrder(id, direction, setLoading) {
  return async () => {
    try {
      return await handleRequest(apiClient.post(`/chat/epoch/adjust/${id}`, { direction }), setLoading);
    } catch (error) { throw error; }
  };
}

export function ReelEyeShowAction(id, eyeshow, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.put(`/chat/reel/${id}/eyeshow`, { eyeshow }), setLoading);
      dispatch({ type: types.EYESHOW_REEL, payload: { id, eyeshow, data } });
      return data;
    } catch (error) { throw error; }
  };
}

/**
 * FEEDBACK & REPORT ACTIONS
 */

export function GetAllFeedback(setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get("/chat/feedback/all"), setLoading);
      dispatch({ type: types.GET_ALL_FEEDBACK, payload: data.feedback || data });
      return data;
    } catch (error) { throw error; }
  };
}

export function GetAllReelReports(setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get("/chat/feedback/reel-report-all"), setLoading);
      dispatch({ type: types.GET_ALL_REEL_REPORTS, payload: data || [] });
      return data;
    } catch (error) { throw error; }
  };
}

/**
 * GALLERY ACTIONS
 */

export function GetGalleryImages(companionId, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get(`/gallery/all/${companionId}`), setLoading);
      dispatch({ type: types.GET_GALLERY_IMAGES, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export function UploadGalleryImages(companionId, formData, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post(`/gallery/upload/${companionId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }), setLoading);
      dispatch({ type: types.UPLOAD_GALLERY_IMAGES, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export function DeleteGalleryImage(companionId, imageId, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.delete(`/gallery/delete/${companionId}/${imageId}`), setLoading);
      dispatch({ type: types.DELETE_GALLERY_IMAGE, payload: { companionId, imageId, data } });
      return data;
    } catch (error) { throw error; }
  };
}

export function DeleteMultipleGalleryImages(companionId, imageIds, setLoading) {
  return async (dispatch) => {
    try {
      // Trying without leading slash to see if it fixes construction or server routing issues
      const data = await handleRequest(apiClient.request({
        method: 'delete',
        url: `gallery/${companionId}/multiple`,
        data: { image_ids: imageIds }
      }), setLoading);
      dispatch({ type: types.DELETE_MULTIPLE_GALLERY_IMAGES, payload: { companionId, imageIds, data } });
      return data;
    } catch (error) { throw error; }
  };
}


/**
 * PAGINATION ACTIONS
 */
export const SetCompanionsPagination = (page, rowsPerPage) => ({
  type: types.SET_COMPANIONS_PAGINATION,
  payload: { page, rowsPerPage },
});

export const SetReelsPagination = (page, rowsPerPage) => ({
  type: types.SET_REELS_PAGINATION,
  payload: { page, rowsPerPage },
});

/**
 * LIVE MODE ACTIONS
 */

export function GetLiveMode(setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.get("/companion/api/admin/live-mode"), setLoading);
      dispatch({ type: types.GET_LIVE_MODE, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}

export function UpdateLiveMode(payload, setLoading) {
  return async (dispatch) => {
    try {
      const data = await handleRequest(apiClient.post("/companion/api/admin/live-mode", payload), setLoading);
      dispatch({ type: types.UPDATE_LIVE_MODE, payload: data });
      return data;
    } catch (error) { throw error; }
  };
}
