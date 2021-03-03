$(document).ready(function(){
  $('select').formSelect();

  $('#login-form').on('submit', function(event){
    event.preventDefault();
    console.log(event);
    const data = {};
    $('#login-form input, #login-form select').each(function(index){
      const input = $(this);
      // alert('Type: ' + input.attr('type') + ' Name: ' + input.attr('name') + ' Value: ' + input.val());
      if(input.attr('name')){
        data[input.attr('name')] = input.val();
      }
    });
    console.log(data);

    $.ajax({
      type: 'POST',
      url: '/api/loan',
      data: data,
      dataType: 'json',
      success: function(res){
        console.log(res);
        if (res.success) {
            // data.redirect contains the string URL to redirect to
            // window.location.href = res.redirect;
            $('#success').text(res.success);
        } else {
          $('#error').text(res.error);
        }
      }
    });

  });

});