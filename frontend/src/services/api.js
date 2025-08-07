import axios from 'axios';

// API 基础配置
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : window.location.origin;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: error.message });
  }
);

// 多模态分析 API
export const multimodalAPI = {
  // 统一的多模态分析端点
  processUnifiedAnalysis: async (formData) => {
    try {
      const response = await api.post('/api/multimodal/unified-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 触觉-文本分析
  processTactileText: async (data) => {
    try {
      const response = await api.post('/api/multimodal/tactile-text', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 视觉-文本分析
  processVisionText: async (formData) => {
    try {
      const response = await api.post('/api/multimodal/vision-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 完整多模态分析
  processMultimodalComplete: async (formData) => {
    try {
      const response = await api.post('/api/multimodal/multimodal-complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 少样本学习
  processFewShotLearning: async (data) => {
    try {
      const response = await api.post('/api/multimodal/few-shot-learning', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取可用模板
  getAvailableTemplates: async () => {
    try {
      const response = await api.get('/api/multimodal/available-templates');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 添加自定义模板
  addCustomTemplate: async (data) => {
    try {
      const response = await api.post('/api/multimodal/custom-template', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取模型信息
  getModelInfo: async () => {
    try {
      const response = await api.get('/api/multimodal/model-info');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// 问答系统 API
export const qaAPI = {
  // 单模态问答
  processSingleModality: async (data) => {
    try {
      const response = await api.post('/api/qa/single-modality', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 双模态问答
  processDualModality: async (formData) => {
    try {
      const response = await api.post('/api/qa/dual-modality', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 多模态问答
  processMultimodalQA: async (formData) => {
    try {
      const response = await api.post('/api/qa/multimodal-qa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 上下文问答
  processContextualQA: async (data) => {
    try {
      const response = await api.post('/api/qa/contextual-qa', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取样本问题
  getSampleQuestions: async () => {
    try {
      const response = await api.get('/api/qa/sample-questions');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 批量问答
  processBatchQA: async (data) => {
    try {
      const response = await api.post('/api/qa/batch-qa', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 