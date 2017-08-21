using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AcessoGoogle
{
    public class GetProfile
    {
        public async Task<ObjetoGoogle> Acessar(string idToken)
        {
            try
            {
                //Pega access token para as informações do usuário
                HttpClient client = new HttpClient();

                var values = new Dictionary<string, string>
                {
                    { "code", idToken },
                    { "client_id", "646057312978-8voqfqkpn4aicqnamtdl7o2pj0k4qkp4.apps.googleusercontent.com"},
                    { "client_secret", "3yZy5EjU72xuo25kM8XDEI8k" },
                    { "redirect_uri", "http://localhost:8100"},
                    { "grant_type", "authorization_code" }
                };

                var content = new FormUrlEncodedContent(values);

                var requestAccess = await client.PostAsync("https://www.googleapis.com/oauth2/v4/token", content);

                var conteudoAccess = await requestAccess.Content.ReadAsStringAsync();

                dynamic access = await Task.Factory.StartNew(() => JsonConvert.DeserializeObject(conteudoAccess));

                if(requestAccess.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string token = access.access_token;

                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                    var requestProfile = await client.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");

                    var conteudoProfile = await requestProfile.Content.ReadAsStringAsync();

                    var profile = await Task.Factory.StartNew(() => JsonConvert.DeserializeObject<ObjetoGoogle>(conteudoProfile));

                    return profile;
                }

                return null;
            }
            catch(Exception e)
            {
                throw e;
            }
        }
    }

}
