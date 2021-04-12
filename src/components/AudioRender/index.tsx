import React, { useState, useEffect } from 'react';
import { useMount } from 'ahooks';
import { Spin, message } from 'antd';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

let WaveSurfer: any;
if (process.browser) {
  WaveSurfer = require('wavesurfer.js');
}

const AudioRender: React.FC<any> = ({ src }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [waveform, setWaveform] = useState<React.ReactNode>(null);
  const [wavesurferApi, setWavesurferApi] = useState<any>(null);
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (process.browser && WaveSurfer && waveform && src) {
      console.log('window', src, waveform);
      var wavesurfer = WaveSurfer.create({
        container: waveform,
        waveColor: '#b2b2b2',
        progressColor: '#000',
        interact: true,
        height: 80,
        barWidth: 2,
        barGap: 3,
        cursorColor: 'transparent',
      });

      wavesurfer.load(src);

      wavesurfer.on('ready', () => {
        // wavesurfer.play();
        setWavesurferApi(wavesurfer);
        setLoading(false);
      });
      wavesurfer.on('error', (e: string) => {
        message.error(`加载失败${e}`);
      });
    }
  }, [waveform, src]);

  // 播放切换
  const toggle = () => {
    if (status) {
      wavesurferApi.play();
    } else {
      wavesurferApi.pause();
    }
    setStatus(!status);
  };

  return (
    <Spin spinning={loading}>
      <StyledWaveform ref={e => setWaveform(e)}></StyledWaveform>
      {!loading ? (
        <StyledWaveformBtn onClick={() => toggle()}>
          {status ? <CaretRightOutlined /> : <PauseOutlined />}
        </StyledWaveformBtn>
      ) : null}
    </Spin>
  );
};

const StyledWrapper = styled(Spin)`
  padding: 40px 0;
  width: 100%;
`;
const StyledWaveform = styled.div``;

const StyledWaveformBtn = styled.button`
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 500;
  margin: 20px auto 0;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background: rgb(0, 0, 0);
  border: 2px solid transparent;
  border-radius: 50%;
`;

export default AudioRender;
