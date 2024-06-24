import { useState, useEffect } from 'react';
import axios from 'axios';
import { APP_ID, ErrorDbType } from '../utils/constants';
import { getDeviceInfoForRequests } from '../utils/utils';
import { getErrorsFromDB, saveError } from '../utils/db';
import { useDbContext } from '../context/DbContext';
import { useServiceCall } from '../services/hooks/useServiceCall';
import { GetConexion } from '../services/action/conexionAction';
import { DefaultRootState, useSelector } from 'react-redux';

const useConexionInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [isConectedLow, setIsConectedLow] = useState(false);
  const { db } = useDbContext();
  const { apiHost } = useSelector((st: DefaultRootState) => st.transient.environment);

  useEffect(() => {
    downloadFile();
  }, []);

  const downloadFile = async () => {
    try {
      const startTime = new Date().getTime();
      const timestamp = new Date().getTime();
      const url = `${apiHost}/sync/connection-test?timestamp=${timestamp}`;

      const config = {
        headers: {
          'device-info': JSON.stringify(await getDeviceInfoForRequests()),
          'app-id': APP_ID
        },
        responseType: 'blob',
        onDownloadProgress: (progressEvent: any) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percentage)
          setProgress(percentage);
        }
      }

      const response = (await Promise.race([
        axios.get(url, config),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 60000)),
      ])) as Response;

      if (response.status !== 200) {
        throw new Error('Error de descarga');
      }

      const endTime = new Date().getTime();
      const elapsedTime = endTime - startTime;

      if (elapsedTime > 20000) {
        setIsConectedLow(true);
      }

      setIsConnected(true);
      console.log('Archivo descargado');
    } catch (error: any) {
      console.error('Error al descargar el archivo:', error);
      const errorDetail = error?.message ?? JSON.stringify(error);
      saveErrorOnDB(errorDetail, ErrorDbType.CONEXION_TEST_ERROR);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveErrorOnDB = async (description: string, type: ErrorDbType): Promise<void> => {
    try {
      const deviceInfo = await getDeviceInfoForRequests();
      await saveError(db!, {
        description: description,
        date: new Date(),
        type: type,
        deviceUniqueId: deviceInfo?.uniqueId,
        deviceName: deviceInfo?.name,
        operativeSystem: deviceInfo?.operativeSystem,
        operativeSystemVersion: deviceInfo?.operativeSystemVersion,
        brand: deviceInfo?.brand,
        model: deviceInfo?.model,
        appVersion: deviceInfo?.appVersion,
        connectionType: deviceInfo?.connectionType
      });
      console.log('saveErrorOnDB - success');
    } catch (error) {
      console.log('saveErrorOnDB - Fail: ', error);
    }
  }

  return {
    isLoading,
    progress,
    isConnected,
    isConectedLow,
    downloadFile,
    saveErrorOnDB,
  };
};

export default useConexionInfo;