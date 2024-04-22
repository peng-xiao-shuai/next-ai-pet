import AppConfigEnv from './get-config';

/**
 * 转换接口返回图片地址路径
 */
export function filterImage(url: string, side?: string) {
  if (!url) return '';

  if (url.startsWith('file:')) return url;

  const isHttpUrl = url && url.indexOf('http') === -1 && url.indexOf('/') !== 0;

  if (!isHttpUrl) return url;

  if (side) url += `?x-oss-process=image/resize,m_lfit,w_${side}`;
  return AppConfigEnv.OSS + url;
}

/**
 * @desc 简写时间
 * @param date 字符串时间
 */
export function filterAbbrTime(date: string | Date) {
  if (!date) return '';
  const fmt = 'yyyy-MM-dd hh:mm';
  const newTime = filterFormatDate(date, fmt);
  const today = filterFormatDate(new Date(), fmt);
  return newTime.slice(0, 10) === today.slice(0, 10)
    ? filterFormatDate(date, 'hh:mm')
    : filterFormatDate(date, 'yyyy-MM-dd');
}

/**
 * @desc 格式化时间
 * @param date date对象/时间戳/字符串时间
 * @param fmt 格式
 * @return 格式化时间字符串
 */
export const filterFormatDate = (
  date: string | Date,
  fmt = 'yyyy-MM-dd hh:mm:ss'
) => {
  if (!date) return '-';
  // 时间戳
  if (!Number.isNaN(+date)) date = new Date(+date);
  // 字符串
  else if (!(date instanceof Date))
    date = new Date(`${date}`.replace(/-/g, '/'));
  if (Number.isNaN(date.getTime())) return '-';
  const opt = {
    'y+': `${date.getFullYear()}`, // 年
    'M+': `${date.getMonth() + 1}`, // 月
    'd+': `${date.getDate()}`, // 日
    'h+': `${date.getHours()}`, // 时
    'm+': `${date.getMinutes()}`, // 分
    's+': `${date.getSeconds()}`, // 秒
    'q+': `${Math.floor((date.getMonth() + 3) / 3)}`, // 季度
  };
  Object.keys(opt).forEach((k) => {
    const ret = new RegExp(`${k}`).exec(fmt);
    if (ret)
      fmt = fmt.replace(
        ret[0],
        opt[k as keyof typeof opt].padStart(ret[0].length, '0')
      );
  });
  return fmt;
};
