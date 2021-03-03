$(document).ready(function(){

  $('#login-form').on('submit', function(event){
    event.preventDefault();
    console.log(event);
    const data = {};
    $('#login-form input').each(function(index){
      const input = $(this);
      // alert('Type: ' + input.attr('type') + ' Name: ' + input.attr('name') + ' Value: ' + input.val());
      if(input.attr('name')){
        data[input.attr('name')] = input.val();
      }
    });
    console.log(data);

    $.ajax({
      type: 'POST',
      url: '/api/account',
      data: data,
      dataType: 'json',
      success: function(res){
        console.log(res);
        if (res.redirect) {
            // data.redirect contains the string URL to redirect to
            window.location.href = res.redirect;
        } else {
          $('#error').text(res.error);
        }
      }
    });

  });

});