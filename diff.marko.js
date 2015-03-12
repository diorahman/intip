exports.create = function(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      attr = __helpers.a,
      forEach = __helpers.f,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w('<p>harian blankon</p><a' +
      attr("href", data.blankonUrl) +
      '>daftar paket harian</a><p>lebih kecil dari sid</p>');

    if (notEmpty(data.less)) {
      out.w('<ul>');

      forEach(data.less, function(package) {
        out.w('<li><b>' +
          escapeXml(package.name) +
          '</b> <span>' +
          escapeXml(package.blankonVersion) +
          '</span> ' +
          escapeXml(package.sidVersion) +
          '</li>');
      });

      out.w('</ul>');
    }
    else {
      out.w('<div>aman!</div>');
    }

    out.w('<p>lebih besar dari sid</p>');

    if (notEmpty(data.greater)) {
      out.w('<ul>');

      forEach(data.greater, function(package) {
        out.w('<li><b>' +
          escapeXml(package.name) +
          '</b> <span>' +
          escapeXml(package.blankonVersion) +
          '</span> ' +
          escapeXml(package.sidVersion) +
          '</li>');
      });

      out.w('</ul>');
    }
    else {
      out.w('<div>keren!</div>');
    }

    out.w('<p>hak cipta blankon 2015</p>');
  };
}