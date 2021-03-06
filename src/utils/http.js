/* eslint-disable */
import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";

const baseURL = "http://localhost:4000";

let requestCount = 0;

const config = {
	baseURL: baseURL || "",
	timeout: 60000,
	crossDomain: true,
	withCredentials: true,
	validateStatus(status) {
		return status >= 200 && status < 500;
	}
};

const _axios = axios.create(config);

// 展示loading
function showLoading() {
	if (requestCount === 0) {
		const dom = document.createElement("div");
		dom.setAttribute("id", "loading");
		document.body.appendChild(dom);
		ReactDOM.render(<Spin tip='加载中...' />, dom);
	}
	requestCount++;
}

// 隐藏loading
function hideLoading() {
	requestCount--;
	if (requestCount === 0) {
		document.body.removeChild(document.getElementById("loading"));
	}
}

// 请求拦截
_axios.interceptors.request.use(
	originConfig => {
		const reqConfig = { ...originConfig };

		if (reqConfig.headers.isLoading !== false) {
			showLoading();
		}

		if (!reqConfig.url) {
			throw new Error("request need url");
		}

		if (!reqConfig.method) {
			reqConfig.method = "get";
		}

		reqConfig.method = reqConfig.method.toLowerCase();

		// 参数容错
		if (reqConfig.method === "get") {
			// 防止字段用错
			if (!reqConfig.params) {
				reqConfig.params = reqConfig.data || {};
			}
		} else if (reqConfig.method === "post") {
			// 防止字段用错
			if (!reqConfig.data) {
				reqConfig.data = reqConfig.params || {};
			}
		} else {
			// TODO: 暂无其他类型的处理
		}
		return reqConfig;
	},
	error => {
		if (error.config.headers.isLoading !== false) {
			hideLoading();
		}
		Promise.reject(error);
	}
);

// 响应拦截
_axios.interceptors.response.use(
	response => {
		if (response.config.headers.isLoading !== false) {
			hideLoading();
		}
		const res = response.data;

		if (res.code !== 200) {
			return Promise.reject(res.message || "error");
		}
		return res;
	},
	error => {
		if (error.config.headers.isLoading !== false) {
			hideLoading();
		}
		return Promise.reject(error);
	}
);

/**
 * @param {string} url
 * @param {object} data
 * @param {object} headers
 * @param {object} params
 */
export function post(url, data = {}, headers = {}, params = {}) {
	return _axios({
		method: "post",
		url,
		data,
		params,
		headers
	});
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}, headers = {}) {
	return _axios({
		method: "get",
		url,
		params,
		headers
	});
}
_axios.prototype = axios;
export default _axios;
