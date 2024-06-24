using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace FordEvents.ApiClientInvoker
{
    public abstract class BaseInvoker
    {

        private readonly IHttpClientFactory _clientFactory;
        protected ILogger _logger;

        public BaseInvoker(IHttpClientFactory clientFactory, ILogger logger)
        {
            _clientFactory = clientFactory;
            _logger = logger;
        }

        protected T Get<T>(string url, Dictionary<string, string> headers = null, Dictionary<string, string> queryParams = null)
        {
            // Add QueryParams
            string uri = queryParams == null ? url : QueryHelpers.AddQueryString(url, queryParams);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, uri);
            // Add Headers
            buildHeaders(request, headers);
            // Create Client
            var httpClient = _clientFactory.CreateClient();
            // Send Request
            HttpResponseMessage response = httpClient.Send(request);
            if (response.IsSuccessStatusCode)
            {
                return Deserialize<T>(response.Content.ReadAsStream());
            }
            else
            {
                return default(T);
            }
        }

        protected T Post<T>(string url, object body, Dictionary<string, string> headers = null, Dictionary<string, string> queryParams = null)
        {
            // Add QueryParams
            string uri = queryParams == null ? url : QueryHelpers.AddQueryString(url, queryParams);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, uri);
            // Add Headers
            buildHeaders(request, headers);
            // Add Body
            request.Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            // Create Client
            var httpClient = _clientFactory.CreateClient();
            // Send Request
            HttpResponseMessage response = httpClient.Send(request);
            if (response.IsSuccessStatusCode)
            {
                return Deserialize<T>(response.Content.ReadAsStream());
            }
            else
            {
                return default(T);
            }
        }

        protected void Post(string url, object body, Dictionary<string, string> headers = null, Dictionary<string, string> queryParams = null)
        {
            // Add QueryParams
            string uri = queryParams == null ? url : QueryHelpers.AddQueryString(url, queryParams);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, uri);
            // Add Headers
            buildHeaders(request, headers);
            // Add Body
            request.Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            // Create Client
            var httpClient = _clientFactory.CreateClient();
            // Send Request
            HttpResponseMessage response = httpClient.Send(request);
            if (!response.IsSuccessStatusCode)
                throw new BusinessLogicException(ExceptionCodeEnum.UNHANDLE_ERROR, response.Content.ReadAsStringAsync().Result);
        }

        protected T Put<T>(string url, object body, Dictionary<string, string> headers = null, Dictionary<string, string> queryParams = null)
        {
            // Add QueryParams
            string uri = queryParams == null ? url : QueryHelpers.AddQueryString(url, queryParams);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Put, uri);
            // Add Headers
            buildHeaders(request, headers);
            // Add Body
            request.Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            // Create Client
            var httpClient = _clientFactory.CreateClient();
            // Send Request
            HttpResponseMessage response = httpClient.Send(request);
            if (response.IsSuccessStatusCode)
            {
                return Deserialize<T>(response.Content.ReadAsStream());
            }
            else
            {
                return default(T);
            }
        }

        private void buildHeaders(HttpRequestMessage request, Dictionary<string, string> headers = null)
        {
            if (headers != null && headers.Any())
            {
                foreach (var header in headers.Where(x => !string.IsNullOrEmpty(x.Key)))
                {
                    request.Headers.Add(header.Key, header.Value);
                }
            }
        }

        private T Deserialize<T>(Stream s)
        {
            using (StreamReader reader = new StreamReader(s))
            using (JsonTextReader jsonReader = new JsonTextReader(reader))
            {
                JsonSerializer ser = new JsonSerializer();
                return ser.Deserialize<T>(jsonReader);
            }
        }

    }
}
