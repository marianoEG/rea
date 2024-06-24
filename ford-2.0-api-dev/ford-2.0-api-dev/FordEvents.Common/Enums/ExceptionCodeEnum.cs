using FordEvents.Common.Attributes;
using System.Linq;
using System.Reflection;

namespace FordEvents.Common.Enums
{
    public enum ExceptionCodeEnum
    {
        [ShortDescription("Error inesperado")]
        UNHANDLE_ERROR,

        [ShortDescription("Acceso denegado")]
        ACCESS_DENIED,

        [ShortDescription("Nombre de usuario o contraseña incorrectos")]
        USERNAME_OR_PASSWORD_INCORRECT,

        [ShortDescription("No se encontró el usuario solicitado")]
        USER_NOT_FOUND,

        [ShortDescription("Ya existe un usuario registradocon el email ingresado")]
        USER_ALREADY_EXISTS,

        [ShortDescription("Nombre del usuario es requerido")]
        USER_FIRSTNAME_REQUIRED,

        [ShortDescription("Apellido del usuario es requerido")]
        USER_LASTNAME_REQUIRED,

        [ShortDescription("Contraseña del usuario es requerida")]
        USER_PASSWORD_REQUIRED,

        [ShortDescription("Perfil del usuario es requerido")]
        USER_PROFILE_REQUIRED,

        [ShortDescription("No se encontró el evento solicitado")]
        EVENT_NOT_FOUND,

        [ShortDescription("El código del evento es requerido")]
        EVENT_CODE_REQUIRED,

        [ShortDescription("El nombre del evento es requerido")]
        EVENT_NAME_REQUIRED,

        [ShortDescription("No se encontró el subevento solicitado")]
        SUBEVENT_NOT_FOUND,

        [ShortDescription("El nombre del subevento es requerido")]
        SUBEVENT_NAME_REQUIRED,

        [ShortDescription("Se completó la capacidad del invitados")]
        SUBEVENT_IS_FULL,

        [ShortDescription("El número de invitados nuevo no puede ser menor al número de invitados actual")]
        SUBEVENT_GUEST_NUMBER_MINOR,

        [ShortDescription("Recurso requerido")]
        FILE_RESOURCE_REQUIRED,

        [ShortDescription("No se encontró el vehículo solicitado")]
        VEHICLE_NOT_FOUND,

        [ShortDescription("Nombre del vehículo es requerido")]
        VEHICLE_NAME_REQUIRED,

        [ShortDescription("Tipo de vehículo es requerido")]
        VEHICLE_TYPE_REQUIRED,

        [ShortDescription("Tipo de vehículo inválido")]
        INVALID_VEHICLE_TYPE,

        [ShortDescription("Nombre de la versión es requerido")]
        VERSION_NAME_REQUIRED,

        [ShortDescription("Precio de la versión es requerido")]
        VERSION_PRICE_REQUIRED,

        [ShortDescription("Moneda del precio de la versión es requerido")]
        VERSION_PRICE_CURRENCY_REQUIRED,

        [ShortDescription("Moneda del precio de la versión inválida")]
        INVALID_VERSION_PRICE_CURRENCY,

        [ShortDescription("Nombre del grupo de carácteristicas es requerido")]
        FEATURES_GROUP_NAME_REQUIRED,

        [ShortDescription("No se encontró la característica solicitada")]
        FEATURE_NOT_FOUND,

        [ShortDescription("Nombre de la caracteristica es requerido")]
        FEATURE_NAME_REQUIRED,

        [ShortDescription("Valor de versión caracteristica es requerido")]
        FEATURE_VERSION_VALUE_REQUIRED,

        [ShortDescription("No se encontró la versión solicitada")]
        VERSION_NOT_FOUND,

        [ShortDescription("No se encontró la concesionaria solicitada")]
        DEALERSHIP_NOT_FOUND,

        [ShortDescription("El nombre del consecionario es requerido")]
        DEALERSHIP_NAME_REQUIRED,

        [ShortDescription("No se encontró la provincia solicitada")]
        PROVINCE_NOT_FOUND,

        [ShortDescription("No se encontró la ciudad solicitada")]
        CITY_NOT_FOUND,

        [ShortDescription("No se encontró el accesorio solicitado")]
        VEHICLE_ACCESSORY_NOT_FOUND,

        [ShortDescription("Nombre del vehículo es requerido")]
        VEHICLE_ACCESSORY_NAME_REQUIRED,

        [ShortDescription("No se encontró el invitado solicitado")]
        GUEST_NOT_FOUND,

        [ShortDescription("Invitados es requerido")]
        GUEST_ARE_REQUIRED,

        [ShortDescription("Nombre del invitado es requerido")]
        GUEST_FIRSTNAME_REQUIRED,

        [ShortDescription("Apellido del invitado es requerido")]
        GUEST_LASTNAME_REQUIRED,

        [ShortDescription("Tipo de invitado es requerido")]
        GUEST_TYPE_REQUIRED,

        [ShortDescription("Tipo de invitado inválido")]
        INVALID_GUEST_TYPE,

        [ShortDescription("Estado de invitado es requerido")]
        GUEST_STATE_REQUIRED,

        [ShortDescription("Estado de invitado inválido")]
        INVALID_GUEST_STATE,

        [ShortDescription("No se encontró el formulario solicitado")]
        FORM_NOT_FOUND,

        [ShortDescription("Clave de la configuración es requerido")]
        CONFIGURATION_KEY_REQUIRED,

        [ShortDescription("Valor de la configuración es requerido")]
        CONFIGURATION_VALUE_REQUIRED,

        [ShortDescription("Ya existe una configuración con esa clave")]
        CONFIGURATION_EXISTS,

        [ShortDescription("La contraseña nueva debe ser diferente a la contraseña expirada")]
        USER_PASSWORD_CANT_BE_EQUAL,

        [ShortDescription("La contraseña es insegura")]
        USER_PASSWORD_WEAK,

        [ShortDescription("Contraseña expirada")]
        USER_PASSWORD_EXPIRED,

        [ShortDescription("Perfil de usuario invalido")]
        INVALID_USER_PROFILE,

        [ShortDescription("Los eventos son requeridos")]
        EVENTS_ARE_REQUIRED,

        [ShortDescription("No se encontró el archivo")]
        FILE_NOT_FOUND,

        [ShortDescription("búsquedas de campaña es requerido")]
        CAMPAIGN_SEARCH_ARE_REQUIRED,

        [ShortDescription("No se encontró el dispositivo solicitado")]
        DEVICE_NOT_FOUND,

        [ShortDescription("Ocurrió un error al hacer login contra SaleForce")]
        SALE_FORCE_LOGIN_ERROR,

        [ShortDescription("No se encontró la campaña solicitada")]
        CAMPAIGN_NOT_FOUND,

        [ShortDescription("No se encontró la notificación solicitada")]
        NOTIFICATION_NOT_FOUND,

    }

    public static class ExceptionCodeEnumExtensions
    {
        public static string ToShortDescription(this ExceptionCodeEnum? enumParam)
        {
            if (enumParam == null)
                return string.Empty;

            return enumParam.Value.ToShortDescription();
        }

        public static string ToShortDescription(this ExceptionCodeEnum enumParam)
        {
            MemberInfo memberInfo = enumParam.GetType().GetMember(enumParam.ToString()).FirstOrDefault();
            if (memberInfo != null)
            {
                ShortDescriptionAttribute attribute = (ShortDescriptionAttribute)memberInfo.GetCustomAttributes(typeof(ShortDescriptionAttribute), false).FirstOrDefault();
                if (attribute != null)
                    return attribute.ShortDescription;
                else
                    return string.Empty;
            }
            return string.Empty;
        }
    }
}
