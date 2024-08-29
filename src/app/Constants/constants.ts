import { environment } from "src/environments/environment";
export class Constants {
  public static BASE_URL = environment.BASEURL;
  public static API = {
    LOGIN: 'user/login',
    SIGNUP: 'user/signup',
    SIGNUP_VERIFICATION: 'user/signup-verification',
    FORGOT: 'user/forgot',
    FORGOT_VERIFICATION: 'user/forgot-verification',
    CHANGE_PASSWORD: 'user/change-password',
    FETCH_USER_INFO: 'user/fetchUserInfo',
    EDIT_PROFILE: 'user/editProfile',
    DELETE_USER: 'user/deleteProfile',
    FETCH_IMG: 'user/fetchImg',

    CLEAR_SOCKET: 'clearSocket',
   


    ADD_CONTACT: 'contact/addContact',
    FETCH_CONTACT_INFO: 'contact/getContacts',
    FETCH_CONTACTS_TABLE: 'contact/getContactsTable',
    DELETE_CONTACT: 'contact/delete',
    DELETE_ALL_CONTACT: 'contact/deleteAll',
    EDIT_CONTACT: 'contact/edit',
    DOWNLOAD_CONTACT: 'contact/download',

    GET_CHAT_CONTACTS: 'chat/getChatContacts',
    GET_ALL_CHAT_CONTACTS: 'chat/getAllChatContacts',
    GET_INVITE_CONTACTS: 'chat/getInviteContacts',
    SEND_MSG: 'chat/sendChatMsg',
    GET_MSG: 'chat/getChatMsg',
    DELETE_CHAT_HISTORY: 'chat/deleteChatHistory',
    GET_SEARCH_CHAT_CONTACT: 'chat/getSearchChatContact',

    UPLOAD_VIDEOS : 'videos/uploadVideo',

    UPLOAD_FILE : 'drive/uploadFile',
    FETCH_FILE : 'drive/fetchFile'
    
  }

  public static APP = {
    SESSION_ESTIMATE_DETAILS: "estimate_details",
    SESSION_ORDER_SERVICE: "order_servicelist",
    SESSION_VECHICLE_LIST: "vechicle_list",
    SESSION_ESTIMATE_TIME: "estimate_time",
    SESSION_USER_DATA: "user_data",
    SESSION_ID: "session_id",
    QUOTE_ID: "quote_id",
    USER_LOGIN: "user_login",
    LOCATION_ARRAY: "location_array_list",
    SERVICE_LIST: "service-list",
    SELECTED_TAB : "selected-tab",
    SELECTED_PROFILE_TAB : "selected_profile_tab",
    SELECTED_SIDENAV  : "selected_sidenav",
    SELECTED_TOPNAV : "selected_topnav",
    GARAGE_INFO: "garageInfo",
    ADD_GARAGE_INFO:"add_garage_info",
    DRIVER_INFO : "driver_info"
  }

}