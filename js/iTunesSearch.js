// iTunes Search
var data;
var songData;
var entity;
var collectionId;
var songList;

$(function() {
    // search(section1)
    $("#search").click(function() {
        $(".loadingWrap").fadeIn();
        entity = $(this).parents('.dropdown').find('input[name="dropdown-value"]').val();
        term = $(this).parents('.dropdown').find('.form-control').val();
        params = {
            'term': term,
            'lang': 'ja_jp',
            'entity': entity,
            'country': 'JP',
            'limit': 100,
        }
        // substring(bite)
        function substr(text, len, truncation) {
            if (truncation === undefined) {
                truncation = '';
            }
            var text_array = text.split('');
            var count = 0;
            var str = '';
            for (i = 0; i < text_array.length; i++) {
                var n = escape(text_array[i]);
                if (n.length < 4) count++;
                else count += 2;
                if (count > len) {
                    return str + truncation;
                }
                str += text.charAt(i);
            }
            return text;
        }
        // searchRequest
        $.ajax({
            url: 'https://itunes.apple.com/search',
            method: 'GET',
            data: params,
            dataType: 'jsonp',
            success: function(json) {
                $(".loadingWrap").fadeOut();
                var data = json.results;
                console.log(data);
                window.localStorage.setItem('searchResult', JSON.stringify(data));
                // error
                if (data.length == 0) {
                    html = '<div class="col-xs-4 col-xs-offset-4"><p>Not found. Please try other keywords.</p></div>';
                    $('.searchResult').append(html);
                } else {
                    switch (params.entity) {
                        case "movie":
                            $.each(data,
                                function(index, element) {
                                    trackName = substr(element.trackName, 36, '...');
                                    html = '<div class="col-xs-12 col-sm-3 col-md-2"><div class="thumbnail"><img alt="' + element.trackName + '" src="' + element.artworkUrl100 + '" style="width: 100px; display: block;"><div class="caption"><h3>' + trackName + '</h3><p class="detail btn btn-default" role="button" data-value="' + index + '" >Detail</span></p></div></div></div>';
                                    $('.searchResult').append(html);
                                });
                            break;
                        case "album":
                            $.each(data,
                                function(index, element) {
                                    trackName = substr(element.collectionName, 36, '...');
                                    price = element.collectionPrice.toLocaleString();
                                    html = '<div class="col-xs-12 col-sm-3 col-md-2"><div class="thumbnail"><img alt="' + element.collectionName + '" src="' + element.artworkUrl100 + '" style="width: 100px; display: block;"><div class="caption"><h3>' + trackName + '</h3><p>\\' + price + '</p><p class="detail btn btn-default" role="button" data-id="' + element.collectionId + '" data-value="' + index + '" >Detail</span></p></div></div></div>';
                                    $('.searchResult').append(html);
                                });
                            break;
                        case "song":
                            $.each(data,
                                function(index, element) {
                                    trackName = substr(element.trackName, 36, '...');
                                    price = element.trackPrice.toLocaleString();
                                    html = '<div class="col-xs-12 col-sm-3 col-md-2"><div class="thumbnail"><img alt="' + element.trackName + '" src="' + element.artworkUrl100 + '" style="width: 100px; display: block;"><div class="caption"><h3>' + trackName + '</h3><p>\\' + price + '</p><p class="detail btn btn-default" role="button" data-value="' + index + '" >Detail</span></p></div></div></div>';
                                    $('.searchResult').append(html);
                                });
                            break;
                        default:
                            $.each(data,
                                function(index, element) {
                                    trackName = substr(element.trackName, 36, '...');
                                    html = '<div class="col-xs-12 col-sm-3 col-md-2"><div class="thumbnail"><img alt="' + element.trackName + '" src="' + element.artworkUrl100 + '" style="width: 100px; display: block;"><div class="caption"><h3>' + trackName + '</h3><p>' + element.formattedPrice + '</p><p class="detail btn btn-default" role="button" data-value="' + index + '" >Detail</span></p></div></div></div>';
                                    $('.searchResult').append(html);
                                });
                            break;
                    }
                }
            },
            error: function() {
                console.log('itunes api search error. ', arguments);
            },
        });
    });
    // detail(section2)
    $(document).on('click', '.detail', function() {
        $(".loadingWrap").fadeIn();
        data = window.localStorage.getItem('searchResult');
        data = JSON.parse(data);
        arrayID = $(this).data('value');
        collectionId = $(this).data('id');
        detailResult = data[Number(arrayID)];
        console.log(detailResult);
        switch (entity) {
            case "movie":
                artworkUrl227 = detailResult.artworkUrl100.replace(/100/gi, "227");
                description = detailResult.longDescription.replace(/\r?\n/gi, "<br>");
                price = detailResult.trackPrice.toLocaleString();
                rentalPrice = detailResult.trackRentalPrice.toLocaleString()
                html = '<div class="col-xs-12 col-md-10 col-md-offset-1"><div class="thumbnail"><div class="img"><img alt="' + detailResult.trackName + '" src="' + artworkUrl227 + '"display: block;"><p><a href="' + detailResult.trackViewUrl + '" class="btn btn-default btn-lg" role="button">store link</a></p><p class="price">buy: \\' + price + '</p><p class="price">rental: \\' + rentalPrice + '</p></div><div class="caption movie"><h3>' + detailResult.trackName + '</h3><p>category: ' + detailResult.primaryGenreName + '</p><h4>description</h4><p>' + description + '</p></div></div></div>';
                $('.detailResult').append(html);
                break;
            case "album":
                var params = {
                    'id': collectionId,
                    'lang': 'ja_jp',
                    'entity': 'song',
                    'country': 'JP',
                }
                // lookupRequest
                $.ajax({
                    url: 'https://itunes.apple.com/lookup',
                    method: 'GET',
                    data: params,
                    dataType: 'jsonp',
                    success: function(json) {
                        var songData = json.results;
                        songList = '<table class="table"><caption>song list</caption><thead><tr><th></th><th>title</th><th>preview</th></tr></thead><tbody>';
                        for (i = 1; i < songData.length; i++) {
                            songList = songList + '<tr><th scope="row">' + i + '</th><td>' + songData[i].trackName + '</td><td><audio src="' + songData[i].previewUrl + '" controls /></td></tr>';
                        }
                        songList = songList + '</tbody></table>';
                        console.log(songList);
                        artworkUrl170 = detailResult.artworkUrl100.replace(/100/gi, "170");
                        price = detailResult.collectionPrice.toLocaleString();
                        releaseDate = detailResult.releaseDate.replace(/-/g, '/');
                        releaseDate = releaseDate.replace(/T.*/g, '');
                        html = '<div class="col-xs-12 col-md-10 col-md-offset-1"><div class="thumbnail"><div class="img"><img alt="' + detailResult.collectionName + '" src="' + artworkUrl170 + '"display: block;"><p><a href="' + detailResult.collectionViewUrl + '" class="btn btn-default btn-lg" role="button">store link</a></p><p class="price">\\' + price + '</p><p class="price">genre: ' + detailResult.primaryGenreName + '</p><p class="price">release: ' + releaseDate + '</p></div><div class="caption album"><h3>' + detailResult.collectionName + '</h3><h4>' + detailResult.artistName + '</h4>' + songList + '</div></div></div>';
                        $('.detailResult').append(html);
                    },
                    error: function() {
                        console.log('itunes api search error. ', arguments);
                    },
                });
                break;
            case "song":
                artworkUrl170 = detailResult.artworkUrl100.replace(/100/gi, "170");
                price = detailResult.trackPrice.toLocaleString();
                releaseDate = detailResult.releaseDate.replace(/-/g, '/');
                releaseDate = releaseDate.replace(/T.*/g, '');
                html = '<div class="col-xs-12 col-md-10 col-md-offset-1"><div class="thumbnail"><div class="img"><img alt="' + detailResult.trackName + '" src="' + artworkUrl170 + '"display: block;"><p><a href="' + detailResult.trackViewUrl + '" class="btn btn-default btn-lg" role="button">store link</a></p><p class="price">\\' + price + '</p><p class="price">genre: ' + detailResult.primaryGenreName + '</p><p class="price">release: ' + releaseDate + '</p></div><div class="caption song"><h3>' + detailResult.trackName + '</h3><h4>' + detailResult.artistName + '</h4><p>preview: <audio src="' + detailResult.previewUrl + '" controls /></p></div></div></div>';
                $('.detailResult').append(html);
                break;
            case "macSoftware":
                var screenShot = detailResult.screenshotUrls;
                var slider = '<div class="flexslider mac"><ul class="slides">';
                for (i = 0; i < screenShot.length; i++) {
                    slider = slider + '<li><img src="' + screenShot[i] + '"></li>';
                }
                slider = slider + '</ul></div>';
                artworkUrl175 = detailResult.artworkUrl100.replace(/100/gi, "175");
                description = detailResult.description.replace(/\r?\n/gi, "<br>");
                html = '<div class="col-xs-12 col-md-10 col-md-offset-1"><div class="thumbnail"><div class="img"><img alt="' + detailResult.trackName + '" src="' + artworkUrl175 + '"display: block;"><p><a href="' + detailResult.trackViewUrl + '" class="btn btn-default btn-lg" role="button">store link</a></p><p class="price">' + detailResult.formattedPrice + '</p><p class="price">category: ' + detailResult.primaryGenreName + '</p><p class="price">version: ' + detailResult.version + '</p></div><div class="caption"><h3>' + detailResult.trackName + '</h3><h4>' + detailResult.artistName + '</h4>' + slider + '<h4>description</h4><p>' + description + '</p></div></div></div>';
                $('.detailResult').append(html);
                $('.flexslider').flexslider({
                    animation: "slide",
                    directionNav: "false",
                    prevText: "",
                    nextText: "",
                });
                break;
            default:
                var screenShot = detailResult.screenshotUrls;
                var slider = '<div class="flexslider"><ul class="slides">';
                for (i = 0; i < screenShot.length; i++) {
                    slider = slider + '<li><img src="' + screenShot[i] + '"></li>';
                }
                slider = slider + '</ul></div>';
                artworkUrl175 = detailResult.artworkUrl100.replace(/100/gi, "175");
                description = detailResult.description.replace(/\r?\n/gi, "<br>");
                html = '<div class="col-xs-12 col-md-10 col-md-offset-1"><div class="thumbnail"><div class="img"><img alt="' + detailResult.trackName + '" src="' + artworkUrl175 + '"display: block;"><p><a href="' + detailResult.trackViewUrl + '" class="btn btn-default btn-lg" role="button">store link</a></p><p class="price">' + detailResult.formattedPrice + '</p><p class="price">category: ' + detailResult.primaryGenreName + '</p><p class="price">version: ' + detailResult.version + '</p></div><div class="caption"><h3>' + detailResult.trackName + '</h3><h4>' + detailResult.artistName + '</h4>' + slider + '<h4>description</h4><p>' + description + '</p></div></div></div>';
                $('.detailResult').append(html);
                $('.flexslider').flexslider({
                    animation: "slide",
                    directionNav: "false",
                    prevText: "",
                    nextText: "",
                });
                break;
        }
        $(".loadingWrap").fadeOut();
    });
});
