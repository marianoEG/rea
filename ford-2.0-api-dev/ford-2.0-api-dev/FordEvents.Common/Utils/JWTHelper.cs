using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace FordEvents.Common.Utils
{
    public abstract class JWTHelper
    {
        public static readonly string USER_ID = "userId";
        public static readonly string PROFILE = "profile";
        public static readonly string START_DATE = "startDate";
        public static readonly string EXPIRATION_DATE = "expirationDate";

        private static string _jwtSecretKey;

        public static void Initialize(IServiceCollection services, string jwtSecretKey)
        {
            _jwtSecretKey = jwtSecretKey;
            byte[] JWTSecretKeyEncoded = Encoding.ASCII.GetBytes(_jwtSecretKey);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(JWTSecretKeyEncoded),
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    RequireSignedTokens = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        }

        public static string GenerateJWT(Guid userId, string profile, DateTime startDate, DateTime expirationDate)
        {
            ClaimsIdentity claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(USER_ID, userId.ToString()));
            claims.AddClaim(new Claim(PROFILE, profile.ToString()));
            claims.AddClaim(new Claim(START_DATE, startDate.ToString()));
            claims.AddClaim(new Claim(EXPIRATION_DATE, expirationDate.ToString()));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = expirationDate,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSecretKey)), SecurityAlgorithms.HmacSha256Signature)
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }

        public static JwtSecurityToken DecodeToken(string jwtToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(jwtToken);
            return jsonToken as JwtSecurityToken;
        }

        public static string GetClaimValue(string jwtToken, string claimName)
        {
            if (jwtToken == null) return null;
            JwtSecurityToken jsonToken = DecodeToken(jwtToken);
            if (jsonToken == null) return null;
            return jsonToken.Claims.FirstOrDefault(x => x.Type == claimName)?.Value;
        }
    }
}
