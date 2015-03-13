exports.create = function(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      attr = __helpers.a,
      forEach = __helpers.f;

  return function render(data, out) {
    out.w('<!DOCTYPE html> <html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Untung.BlankOn.in"><meta name="author" content><title>Untung.BlankOn.in</title><link href="css/bootstrap.min.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body><nav class="navbar navbar-default navbar-fixed-top" role="navigation"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">Untung.BlankOn.in</a></div></div></nav><div class="container"><div class="row"><h1>Hari Ini Lebih Baik Dari Hari Kemarin</h1><p>terakhir dicek pada: ' +
      escapeXml(data.date) +
      '</p></div><hr><div class="row"><div class="col-lg-12"><a' +
      attr("href", data.blankonUrl) +
      ' class="btn btn-primary">Daftar Paket Harian</a></div></div><br><div class="row"><div class="col-xs-6"><img src="img/lebih-kecil.png" class="img-responsive"><h4>Lebih kecil dari sid</h4><div class="well">');

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

    out.w('</div></div><div class="col-xs-6"><img src="img/lebih-besar.png" class="img-responsive"><h4>Lebih besar dari sid</h4><div class="well">');

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

    out.w('</div></div></div><hr><footer><div class="row"><div class="col-lg-12"><p class="text-center">&copy; 2015 <a href="http://blankonlinux.or.id">Pengembang BlankOn</a></p></div></div></footer></div><script src="js/jquery.js"></script><script src="js/bootstrap.min.js"></script></body></html>');
  };
}