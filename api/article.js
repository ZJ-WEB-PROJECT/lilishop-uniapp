/**
 * 文章相关API
 */

import {http,Method} from '@/utils/request.js';
import api from '@/config/api.js';

/**
 * 获取某个分类的文章列表
 * @param category_type
 */
export function getArticleCategory(category_type) {
  return http.request({
    url: `${api.base}/pages/article-categories`,
    method: Method.GET,
    params: {category_type},
  });
}

/**
 * 获取文章详情
 * @param type
 */
export function getArticleDetail(type) {
  return http.request({
    url: `/other/article/get/${type}`,
    method: Method.GET,
  });
}

/**
 * 获取文章详情
 * @param type
 */
 export function getArticleDetailByType(type) {
  return http.request({
    url: `/other/article/type/${type}`,
    method: Method.GET,
  });
}


/**
 * 获取圈子列表
 * @param 
 */
export function getCircleList(params) {
  return http.request({
    url: '/circle/post',
    method: Method.GET,
    params,
  });
}

/**
 * 发布帖子
 * @param 
 */
export function circleCreate(data) {
  return http.request({
    url: '/circle/post/create',
    method: Method.POST,
    data: data,
  });
}

/**
 * 发布评论
 * @param 
 */
export function commentCreate(data) {
  return http.request({
    url: 'circle/post/comment',
    method: Method.POST,
    data: data,
  });
}

