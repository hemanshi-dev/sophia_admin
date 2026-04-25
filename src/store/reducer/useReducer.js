import * as types from "../action/types";

export const initialState = {
  data: [],
  loading: false,
  isLoaded: false,
};

export function AddCompanion_reducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_COMPANION_DATA:
      return { data: action.payload, loading: false };
    case types.RESET_ADD_COMPANION:
      return { ...initialState };
    default:
      return state;
  }
}

export function GetAllCompanions_reducer(state = { ...initialState, page: 1, rowsPerPage: 10 }, action) {
  switch (action.type) {
    case types.GET_ALL_COMPANIONS:
      return { ...state, data: action.payload, loading: false, isLoaded: true };
    case types.ADD_COMPANION_DATA:
      return {
        ...state,
        data: Array.isArray(state.data) ? [action.payload, ...state.data] : [action.payload],
        isLoaded: true
      };
    case types.UPDATE_COMPANION_DATA:
      const updatedData = Array.isArray(state.data)
        ? state.data.map((c) => {
            const rowId = c.id || c._id;
            const actionId = action.payload.id || action.payload._id;
            return rowId === actionId ? { ...c, ...action.payload } : c;
          })
        : state.data;
      return { ...state, data: updatedData, isLoaded: true };
    case types.DELETE_COMPANION:
      return {
        ...state,
        data: Array.isArray(state.data)
          ? state.data.filter((c) => (c.id || c._id) !== action.payload.id)
          : state.data,
        isLoaded: true
      };
    case types.EYESHOW_COMPANION:
      return {
        ...state,
        data: Array.isArray(state.data)
          ? state.data.map((c) =>
              (c.id || c._id) === action.payload.id ? { ...c, eyeshow: action.payload.fallback, fallback: action.payload.fallback } : c
            )
          : state.data,
        isLoaded: true
      };
    case types.SET_COMPANIONS_PAGINATION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function UpdateCompanion_reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_COMPANION_DATA:
      return { data: action.payload, loading: false };
    case types.RESET_UPDATE_COMPANION:
      return { ...initialState };
    default:
      return state;
  }
}

export function Auth_reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_USER:
      return { data: action.payload, loading: false };
    case types.LOGOUT_USER:
      return { ...initialState };
    default:
      return state;
  }
}

export function DeleteCompanion_reducer(state = initialState, action) {
  switch (action.type) {
    case types.DELETE_COMPANION:
      return { data: action.payload.data, loading: false };
    default:
      return state;
  }
}

export function SearchUsers_reducer(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH_USERS:
      return { data: action.payload, loading: false };
    default:
      return state;
  }
}

export function GetAllUsers_reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_USERS:
      return { 
        data: action.payload.users || [], 
        has_next: action.payload.has_next,
        offset: action.payload.offset || 0,
        total_count: action.payload.total_count,
        loading: false 
      };
    case types.GET_MORE_USERS:
      return { 
        ...state,
        data: [...(state.data || []), ...(action.payload.users || [])], 
        has_next: action.payload.has_next,
        offset: action.payload.offset || 0,
        total_count: action.payload.total_count,
        loading: false 
      };
    default:
      return state;
  }
}

export function AddReel_reducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_REEL_DATA:
      return { data: action.payload, loading: false };
    case types.RESET_ADD_REEL:
      return { ...initialState };
    default:
      return state;
  }
}

export function UpdateReel_reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_REEL_DATA:
      return { data: action.payload, loading: false };
    case types.RESET_UPDATE_REEL:
      return { ...initialState };
    default:
      return state;
  }
}

export function GetAllReels_reducer(state = { ...initialState, page: 1, rowsPerPage: 10 }, action) {
  switch (action.type) {
    case types.GET_ALL_REELS:
      return { ...state, data: action.payload, loading: false, isLoaded: true };
    case types.ADD_REEL_DATA:
      return {
        ...state,
        data: Array.isArray(state.data) ? [action.payload, ...state.data] : [action.payload],
        isLoaded: true
      };
    case types.UPDATE_REEL_DATA:
      const updatedReels = Array.isArray(state.data)
        ? state.data.map((r) => {
            const rowId = r.id || r._id;
            const actionId = action.payload.id || action.payload._id;
            return rowId === actionId ? { ...r, ...action.payload } : r;
          })
        : state.data;
      return { ...state, data: updatedReels, isLoaded: true };
    case types.SET_REELS_PAGINATION:
      return { ...state, ...action.payload };
    case types.DELETE_REEL:
      return {
        ...state,
        data: Array.isArray(state.data)
          ? state.data.filter((r) => (r.id || r._id) !== action.payload.id)
          : state.data,
        isLoaded: true
      };
    case types.EYESHOW_REEL:
      return {
        ...state,
        data: Array.isArray(state.data)
          ? state.data.map((r) =>
              (r.id || r._id) === action.payload.id ? { ...r, eyeshow: action.payload.eyeshow } : r
            )
          : state.data,
        isLoaded: true
      };
    default:
      return state;
  }
}

export function GetAllFeedback_reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_FEEDBACK:
      return { data: action.payload, loading: false };
    default:
      return state;
  }
}

export function GetAllReelReport_reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_REEL_REPORTS:
      return { data: action.payload, loading: false };
    default:
      return state;
  }
}

export function Gallery_reducer(state = { data: [], loading: false, isLoaded: false }, action) {
  switch (action.type) {
    case types.GET_GALLERY_IMAGES:
      return { 
        data: action.payload.images || [], 
        total_images: action.payload.total_images || 0,
        companion_id: action.payload.companion_id,
        loading: false, 
        isLoaded: true 
      };
    case types.UPLOAD_GALLERY_IMAGES:
      return { 
        ...state,
        data: [...(state.data || []), ...(action.payload.images || [])],
        total_images: (state.total_images || 0) + (action.payload.images?.length || 0),
        loading: false 
      };
    case types.DELETE_GALLERY_IMAGE:
      const filteredImages = (state.data || []).filter(img => img.id !== action.payload.imageId);
      return {
        ...state,
        data: filteredImages,
        total_images: filteredImages.length,
        loading: false
      };
    default:
      return state;
  }
}
